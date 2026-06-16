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
from app.schemas.demande import StatusUpdateSchema


def modifier_statut_demande(update_data: dict, current_user: User,current_user_entreprise):

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

    if not ligne_demande:
        return jsonify({
            "error": "Ligne introuvable",
            "details": f"Aucune ligne correspondante",
            "code": "LIGNE DE DEMANDE INTROUVABLE"
    }), 400  # Le 400 est le code HTTP

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

    # Recalculer le statut global
    toutes_les_lignes = LigneDemande.query.filter(
        LigneDemande.demande_id == db_demande.id
    ).all()

    total_accorde = sum(l.qte_accordee for l in toutes_les_lignes if l.qte_accordee is not None)

    if total_accorde >= 1:
        db_demande.statut = "APPROUVEE1"
    else:
        db_demande.statut = "REJETEE1"

    if status == "LIVREE":
        # On ne travaille QUE sur la ligne spécifique validée
        
        # 1. Mise à jour du statut de la ligne courante
        ligne_demande.statut_ligne = status

        # 2. Gestion du stock UNIQUEMENT pour cette ligne
        stock = Stock.query.filter(
            Stock.materiel_id == ligne_demande.materiel_id,
            Stock.departement_id == current_user.departement_id
        ).first()

        if not stock:
            return jsonify({
                "error": "Materiel non trouvé en stokc",
                "details":"",
                "code": "Materiel introuvable"
            }),400
            

        # Vérification stricte (utilisation de >= pour gérer le cas où stock == qte)
        if stock.quantite_actuelle >= ligne_demande.qte_accordee:
            stock.quantite_actuelle -= ligne_demande.qte_accordee

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
        else:
            return jsonify({
                "error": "Stock insuffisant",
                "details": f"Il ne reste que {stock.quantite_actuelle} unités",
                "code": "INSUFFICIENT_STOCK"
            }), 400  # Le 400 est le code HTTP
    # Annulation sécurisée
    if status == "ANNULEE":
        if db_demande.demandeur_id != current_user.id:
            return jsonify({
                "error":"Action interdite",
                "code":"FORBIDDEN_ACTION"
            }),403

    db_demande.traite_par = current_user.id
    db_demande.date_traitement = datetime.now()

    try:
        db.session.commit()
        db.session.refresh(db_demande)
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error":str(e),
        }),500

    return {"message": "Mise à jour réussie", "data": db_demande}