from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.database import db
from app.models.Materiel import Materiel
from app.models.Demande import Demande, StatutDemande
from app.models.Stock import Stock
from app.utils.auth import get_current_user, get_current_user_entreprise

stats_bp = Blueprint("stats", __name__, url_prefix="/stats")


@stats_bp.route("/dashboard", methods=["GET"])
def show_stats():
    current_user_entreprise = get_current_user_entreprise()
    print(f"Entreprise ID pour les stats : {current_user_entreprise.entreprise_id}")
    total_materiels = db.session.query(Materiel).filter(
        Materiel.entreprise_id == current_user_entreprise.entreprise_id
    ).count()
    total_demandes = db.session.query(Demande).filter(
        Demande.entreprise_id == current_user_entreprise.entreprise_id
    ).count()
    demandes_approuvees = db.session.query(Demande).filter(
        Demande.statut == StatutDemande.APPROUVEE1,
        Demande.entreprise_id == current_user_entreprise.entreprise_id
    ).count()
    alertes_stock = db.session.query(Stock).filter(
        Stock.quantite_actuelle <= Stock.seuil_alerte,
        Stock.entreprise_id == current_user_entreprise.entreprise_id
    ).count()

    # ─── ACTIVITÉ HEBDO ───────────────────────────────
    il_y_a_7_jours = datetime.now() - timedelta(days=7)

    demandes_recentes = db.session.query(Demande).filter(
        Demande.date_soumission >= il_y_a_7_jours,
        Demande.entreprise_id == current_user_entreprise.entreprise_id
    ).all()

    jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    compte = {j: 0 for j in jours}

    for d in demandes_recentes:
        jour_idx = d.date_soumission.weekday()
        compte[jours[jour_idx]] += 1

    activite_hebdo = [
        {"label": j, "value": compte[j]} for j in jours
    ]

    return jsonify({
        "total_materiels": total_materiels,
        "total_demandes": total_demandes,
        "demandes_approuvees": demandes_approuvees,
        "alertes_stock": alertes_stock,
        "activite_hebdo": activite_hebdo,
    }), 200