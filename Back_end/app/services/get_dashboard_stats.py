import logging
 
from app.database import db
from app.models.Demande import Demande, StatutDemande
from app.models.MouvementStock import MouvementStock, TypeMouvement
from app.models.Stock import Stock
from app.models.User import User, RoleUser
from app.models.LigneDemande import LigneDemande
from app.models.Materiel import Materiel
from app.models.InventaireMaterielEmploye import InventaireEmploye
from sqlalchemy import func
from datetime import datetime, timedelta
 
logger = logging.getLogger(__name__)
 
# Durée en jours par option du sélecteur de période côté front
JOURS_PAR_PERIODE = {
    "semaine": 7,
    "mois": 30,
    "annee": 365,
}
 
 
def get_dashboard_stats(current_user: User, current_user_entreprise, periode: str = "semaine"):
    jours = JOURS_PAR_PERIODE.get(periode, 7)
    depuis = datetime.now() - timedelta(days=jours)

    if current_user.role == RoleUser.EMPLOYE:
        demande_filter = Demande.demandeur_id == current_user.id
        stock_filter = InventaireEmploye.user_id == current_user.id
        top_material_filter = Demande.demandeur_id == current_user.id
        activite_filter = Demande.demandeur_id == current_user.id
        demande_scope_label = "employe"
    else:
        demande_filter = Demande.departement_id == current_user.departement_id
        stock_filter = Stock.departement_id == current_user.departement_id
        top_material_filter = Demande.departement_id == current_user.departement_id
        activite_filter = Demande.departement_id == current_user.departement_id
        demande_scope_label = "departement"

    # Lignes de demandes encore actives
    total_lignes_demandes_a_traiter = (
        LigneDemande.query.join(Demande)
        .filter(
            demande_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            ~LigneDemande.statut_ligne.in_([
                StatutDemande.REJETEE1.value,
                StatutDemande.LIVREE.value,
            ]),
        )
        .count()
    )

    # Lignes bloquées faute de stock
    total_demandes_en_cours = (
        LigneDemande.query.join(Demande)
        .filter(
            demande_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            LigneDemande.statut_ligne == StatutDemande.EN_ATTENTE_STOCK.value,
        )
        .count()
    )

    if current_user.role == RoleUser.EMPLOYE:
        total_materiels_stock_seuil = (
            db.session.query(InventaireEmploye)
            .join(Stock, Stock.materiel_id == InventaireEmploye.materiel_id)
            .filter(
                InventaireEmploye.user_id == current_user.id,
                InventaireEmploye.entreprise_id == current_user_entreprise.entreprise_id,
                InventaireEmploye.quantite < Stock.seuil_alerte,
            )
            .count()
        )
        total_materiels_en_stock = (
            InventaireEmploye.query.filter(
                InventaireEmploye.user_id == current_user.id,
                InventaireEmploye.entreprise_id == current_user_entreprise.entreprise_id,
                InventaireEmploye.quantite > 0,
            ).count()
        )
    else:
        total_materiels_stock_seuil = Stock.query.filter(
            Stock.departement_id == current_user.departement_id,
            Stock.entreprise_id == current_user_entreprise.entreprise_id,
            Stock.quantite_actuelle < Stock.seuil_alerte,
        ).count()
        total_materiels_en_stock = (
            Stock.query.filter(
                Stock.departement_id == current_user.departement_id,
                Stock.entreprise_id == current_user_entreprise.entreprise_id,
                Stock.quantite_actuelle > 0,
            ).count()
        )

    total_demandes_en_attente_global = (
        db.session.query(func.count(func.distinct(LigneDemande.demande_id)))
        .join(Demande, Demande.id == LigneDemande.demande_id)
        .filter(
            demande_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            LigneDemande.statut_ligne.notin_([
                StatutDemande.LIVREE.value,
                StatutDemande.REJETEE1.value,
            ]),
        )
        .scalar()
    ) or 0

    total_demandes_approuvees_global = Demande.query.filter(
        demande_filter,
        Demande.entreprise_id == current_user_entreprise.entreprise_id,
        Demande.date_soumission >= depuis,
        Demande.statut.in_([
            StatutDemande.APPROUVEE1.value,
            StatutDemande.LIVREE.value,
        ]),
    ).count()

    depuis_annee = datetime.now() - timedelta(days=365)

    top_materiels_rows = (
        db.session.query(
            Materiel.id,
            Materiel.designation,
            Materiel.reference,
            func.sum(LigneDemande.qte_demandee).label("quantite_totale"),
            func.count(LigneDemande.id).label("nb_demandes"),
        )
        .join(LigneDemande, LigneDemande.materiel_id == Materiel.id)
        .join(Demande, Demande.id == LigneDemande.demande_id)
        .filter(
            top_material_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            Demande.date_soumission >= depuis_annee,
        )
        .group_by(Materiel.id, Materiel.designation, Materiel.reference)
        .order_by(func.sum(LigneDemande.qte_demandee).desc())
        .limit(5)
        .all()
    )

    materiels_plus_demandes = [
        {
            "materiel_id": row.id,
            "designation": row.designation,
            "reference": row.reference,
            "quantite_totale": int(row.quantite_totale or 0),
            "nb_demandes": row.nb_demandes,
        }
        for row in top_materiels_rows
    ]

    activite_hebdo = []
    if periode == "semaine":
        demandes_recentes = db.session.query(Demande).filter(
            Demande.date_soumission >= depuis,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            activite_filter,
        ).all()

        jours_labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
        compte = {j: 0 for j in jours_labels}
        for d in demandes_recentes:
            compte[jours_labels[d.date_soumission.weekday()]] += 1

        activite_hebdo = [{"label": j, "value": compte[j]} for j in jours_labels]

    total_demandes_approuvees_cette_semaine = (
        LigneDemande.query.join(Demande)
        .filter(
            Demande.date_soumission >= depuis,
            demande_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            LigneDemande.statut_ligne.in_([
                StatutDemande.APPROUVEE1.value,
                StatutDemande.LIVREE.value,
            ]),
        )
        .count()
    )

    total_demandes_rejetees_cette_semaine = (
        LigneDemande.query.join(Demande)
        .filter(
            Demande.date_soumission >= depuis,
            demande_filter,
            Demande.entreprise_id == current_user_entreprise.entreprise_id,
            LigneDemande.statut_ligne == StatutDemande.REJETEE1.value,
        )
        .count()
    )

    decidees = total_demandes_approuvees_cette_semaine + total_demandes_rejetees_cette_semaine
    taux_approbation = (
        round((total_demandes_approuvees_cette_semaine / decidees) * 100)
        if decidees > 0 else None
    )

    if current_user.role == RoleUser.EMPLOYE:
        total_materiels_stock_sortie_cette_semaine = (
            MouvementStock.query.filter(
                MouvementStock.user_id == current_user.id,
                MouvementStock.entreprise_id == current_user_entreprise.entreprise_id,
                MouvementStock.type_mouvement == TypeMouvement.SORTIE,
                MouvementStock.date_mouvement >= depuis,
            ).count()
        )
    else:
        total_materiels_stock_sortie_cette_semaine = MouvementStock.query.filter(
            MouvementStock.departement_id == current_user.departement_id,
            MouvementStock.entreprise_id == current_user_entreprise.entreprise_id,
            MouvementStock.type_mouvement == TypeMouvement.SORTIE,
            MouvementStock.date_mouvement >= depuis,
        ).count()

    logger.debug(
        "dashboard_stats role=%s scope=%s periode=%s a_traiter=%s en_attente_stock=%s sorties=%s",
        current_user.role, demande_scope_label, periode, total_lignes_demandes_a_traiter,
        total_demandes_en_cours, total_materiels_stock_sortie_cette_semaine,
    )

    return {
        "periode": periode,
        "total_lignes_demandes_a_traiter": total_lignes_demandes_a_traiter,
        "total_demandes_en_cours": total_demandes_en_cours,
        "total_demandes_approuvees_cette_semaine": total_demandes_approuvees_cette_semaine,
        "total_demandes_rejetees_cette_semaine": total_demandes_rejetees_cette_semaine,
        "total_materiels_stock_sortie_cette_semaine": total_materiels_stock_sortie_cette_semaine,
        "activite_hebdo": activite_hebdo,
        "alertes_stock": total_materiels_stock_seuil,
        "taux_approbation": taux_approbation,
        "total_demandes_en_attente_global": total_demandes_en_attente_global,
        "total_demandes_approuvees_global": total_demandes_approuvees_global,
        "materiels_plus_demandes": materiels_plus_demandes,
        "total_materiels_en_stock": total_materiels_en_stock,
    }