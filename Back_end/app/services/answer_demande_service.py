from flask import abort
from sqlalchemy import and_
from datetime import datetime

from app.database import db
from app.models.LigneDemande import LigneDemande
from app.models.Demande import Demande
from app.models.User import User
from app.models.MouvementStock import MouvementStock
from app.models.Stock import Stock
from app.models.Materiel import Materiel
from app.schemas.demande import StatusUpdateSchema


def modifier_statut_demande(update_data: dict, current_user: User):

    db_demande = Demande.query.filter(
        Demande.reference == update_data.get("reference")
    ).first()

    # if not db_demande:
    #     abort(404, description="Demande introuvable")

    ligne_demande = LigneDemande.query.filter(
        and_(
            LigneDemande.demande_id == db_demande.id,
            LigneDemande.id == update_data.get("ligne_id")
        )
    ).first()

    # if not ligne_demande:
    #     abort(404, description="Ligne introuvable")

    status = update_data.get("status")

    # Validation partielle
    if status == "APPROUVEE1":
        ligne_demande.qte_accordee = ligne_demande.qte_demandee

    elif status == "REJETEE1":
        ligne_demande.qte_accordee = 0
        materiel = Materiel.query.filter(Materiel.id == ligne_demande.materiel_id).first()
        nom_affichable = materiel.designation if materiel else f"Matériel #{ligne_demande.materiel_id}"

        nouveau_motif = f"[{nom_affichable}]: {update_data.get('motif')}"

        if db_demande.motif_rejet:
            db_demande.motif_rejet += f" | {nouveau_motif}"
        else:
            db_demande.motif_rejet = nouveau_motif

    # Recalculer le statut global
    toutes_les_lignes = LigneDemande.query.filter(
        LigneDemande.demande_id == db_demande.id
    ).all()

    total_accorde = sum(l.qte_accordee for l in toutes_les_lignes if l.qte_accordee is not None)

    if total_accorde >= 1:
        db_demande.statut = "APPROUVEE1"
    else:
        db_demande.statut = "REJETEE1"

    # Livraison
    if status == "LIVREE":
        lignes = LigneDemande.query.filter(
            LigneDemande.demande_id == db_demande.id
        ).all()

        for ligne in lignes:
            stock = Stock.query.filter(
                Stock.materiel_id == ligne.materiel_id,
                Stock.departement_id == current_user.departement_id
            ).first()

            # if not stock:
            #     abort(400, description="Matériel non trouvé en stock")

            # if stock.quantite_actuelle < ligne.qte_accordee:
            #     abort(400, description="Stock insuffisant")

            stock.quantite_actuelle -= ligne.qte_accordee

            mouvement = MouvementStock(
                materiel_id=ligne.materiel_id,
                departement_id=current_user.departement_id,
                quantite=-ligne.qte_accordee,
                type_mouvement="SORTIE",
                demande_id=db_demande.id,
                user_id=current_user.id
            )
            db.session.add(mouvement)

    # Annulation sécurisée
    if status == "ANNULEE":
        if db_demande.demandeur_id != current_user.id:
            abort(403, description="Action interdite")

    db_demande.traite_par = current_user.id
    db_demande.date_traitement = datetime.now()

    try:
        db.session.commit()
        db.session.refresh(db_demande)
    except Exception as e:
        db.session.rollback()
        abort(500, description=str(e))

    # return {"message": "Mise à jour réussie", "data": db_demande}
    return db_demande