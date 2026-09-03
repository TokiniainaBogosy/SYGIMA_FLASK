from flask import jsonify
from sqlalchemy import and_
from datetime import datetime

from app.database import db
from app.models.LigneDemande import LigneDemande
from app.models.Demande import Demande
from app.models.User import User
from app.models.MouvementStock import MouvementStock
from app.models.Stock import Stock
from app.models.Materiel import Materiel
from app.models.InventaireMaterielEmploye import InventaireEmploye
from app.utils.audit import inscrire_historique


def modifier_statut_demande(update_data: dict, current_user: User, current_user_entreprise):

    db_demande = Demande.query.filter(
        Demande.reference == update_data.get("reference")
    ).first()

    ligne_demande = LigneDemande.query.filter(
        and_(
            LigneDemande.demande_id == db_demande.id,
            LigneDemande.id == update_data.get("ligne_id")
        )
    ).first()

    if not ligne_demande:
        return jsonify({
            "error": "Ligne introuvable",
            "code": "LIGNE DE DEMANDE INTROUVABLE"
        }), 400

    status = update_data.get("status")

    # Validation partielle
    if status == "APPROUVEE1":
        ligne_demande.qte_accordee = ligne_demande.qte_demandee
        ligne_demande.statut_ligne = status

    elif status == "REJETEE1":
        ligne_demande.qte_accordee = 0
        ligne_demande.statut_ligne = status
        materiel = Materiel.query.filter(Materiel.id == ligne_demande.materiel_id).first()
        nom_affichable = materiel.designation if materiel else f"Matériel #{ligne_demande.materiel_id}"
        nouveau_motif = f"[{nom_affichable}]: {update_data.get('motif')}"
        if db_demande.motif_rejet:
            db_demande.motif_rejet += f" | {nouveau_motif}"
        else:
            db_demande.motif_rejet = nouveau_motif

    # En attente de stock
    # La ligne est approuvée sur le principe (le responsable est d'accord
    # pour fournir le matériel) mais le stock actuel ne permet pas de
    # livrer tout de suite. La quantité accordée reste fixée à la
    # quantité demandée : elle sera livrée dès que le stock sera
    # réapprovisionné, sans repasser par une nouvelle validation.
    elif status == "EN_ATTENTE_STOCK":
        ligne_demande.statut_ligne = status
        if ligne_demande.qte_accordee is None:
            ligne_demande.qte_accordee = ligne_demande.qte_demandee

    # Recalculer le statut global de la demande à partir de l'état de ses lignes
    toutes_les_lignes = LigneDemande.query.filter(
        LigneDemande.demande_id == db_demande.id
    ).all()

    statuts_lignes = {l.statut_ligne for l in toutes_les_lignes}
    STATUTS_APPROUVES_LIGNE = {"APPROUVEE1", "LIVREE", "EN_ATTENTE_STOCK"}

    if statuts_lignes and statuts_lignes.issubset({"REJETEE1"}):
        # Toutes les lignes sont rejetées
        db_demande.statut = "REJETEE1"
    elif statuts_lignes and statuts_lignes.issubset({"LIVREE"}):
        # Toutes les lignes livrées
        db_demande.statut = "LIVREE"
    elif statuts_lignes & STATUTS_APPROUVES_LIGNE:
        # Dès qu'une seule ligne est approuvée (même en attente de stock),
        # la demande globale passe à APPROUVEE1. On ne fait jamais remonter
        # EN_ATTENTE_STOCK au niveau de la demande : c'est un détail de ligne,
        # pas un statut global.
        db_demande.statut = "APPROUVEE1"
    else:
        total_accorde = sum(l.qte_accordee for l in toutes_les_lignes if l.qte_accordee is not None)
        db_demande.statut = "APPROUVEE1" if total_accorde >= 1 else "REJETEE1"

    # Livraison
    if status == "LIVREE":
        ligne_demande.statut_ligne = status

        # 1. Vérifier le stock du responsable
        stock = Stock.query.filter(
            Stock.materiel_id == ligne_demande.materiel_id,
            Stock.departement_id == current_user.departement_id
        ).first()

        if not stock:
            return jsonify({
                "error": "Matériel non trouvé en stock",
                "code": "MATERIEL_INTROUVABLE"
            }), 400

        if stock.quantite_actuelle < ligne_demande.qte_accordee:
            # Stock insuffisant : la ligne bascule en attente de réapprovisionnement.
            # La demande globale reste APPROUVEE1 (jamais EN_ATTENTE_STOCK au niveau global).
            # BUG CORRIGÉ : cette branche retournait directement une réponse HTTP
            # (jsonify(...), 202), ce qui cassait `answer_demande_route` — celle-ci
            # fait toujours `ligne_demande, db_demande = modifier_statut_demande(...)`,
            # et désempaqueter une réponse Flask dans ces deux variables provoque un
            # crash plus loin (inscrire_historique reçoit un objet Response au lieu
            # d'un LigneDemande). On laisse maintenant le flux continuer normalement
            # jusqu'au commit final commun ; la route lira `ligne_demande.statut_ligne`
            # pour savoir si elle doit répondre 202 ou 200.
            ligne_demande.statut_ligne = "EN_ATTENTE_STOCK"
            db_demande.statut = "APPROUVEE1"
        else:
            # 2. Déduire du stock responsable
            stock.quantite_actuelle -= ligne_demande.qte_accordee

            # 3. Enregistrer le mouvement de sortie
            mouvement = MouvementStock(
                materiel_id=ligne_demande.materiel_id,
                departement_id=current_user.departement_id,
                quantite=-ligne_demande.qte_accordee,
                type_mouvement="SORTIE",
                demande_id=db_demande.id,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id
            )
            db.session.add(mouvement)

            # 4. Mettre à jour l'inventaire de l'employé
            inventaire = InventaireEmploye.query.filter(
                InventaireEmploye.materiel_id == ligne_demande.materiel_id,
                InventaireEmploye.user_id == db_demande.demandeur_id
            ).first()

            if inventaire:
                inventaire.quantite += ligne_demande.qte_accordee
            else:
                inventaire = InventaireEmploye(
                    user_id=db_demande.demandeur_id,
                    materiel_id=ligne_demande.materiel_id,
                    departement_id=db_demande.departement_id,
                    entreprise_id=current_user_entreprise.entreprise_id,
                    demande_id=db_demande.id,
                    quantite=ligne_demande.qte_accordee
                )
                db.session.add(inventaire)

    # Annulation sécurisée
    if status == "ANNULEE":
        if db_demande.demandeur_id != current_user.id:
            return jsonify({
                "error": "Action interdite",
                "code": "FORBIDDEN_ACTION"
            }), 403

    db_demande.traite_par = current_user.id
    db_demande.date_traitement = datetime.now()

    try:
        db.session.commit()
        db.session.refresh(db_demande)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    # Journalisation de la sortie de stock
    # BUG CORRIGÉ : la sortie était bien enregistrée en base (mouvements_stock,
    # stock déduit, inventaire mis à jour) mais jamais journalisée via
    # inscrire_historique, donc invisible dans la page Historique.
    if status == "LIVREE" and "mouvement" in locals():
        materiel = Materiel.query.filter(Materiel.id == ligne_demande.materiel_id).first()
        inscrire_historique(
            action="SORTIE",
            objet_cible=mouvement,
            user_id=current_user.id,
            entreprise_id=current_user_entreprise.entreprise_id,
            details={
                "materiel": materiel.designation if materiel else f"Matériel #{ligne_demande.materiel_id}",
                "quantite_sortie": ligne_demande.qte_accordee,
                "reference_demande": db_demande.reference,
            }
        )

    return ligne_demande, db_demande