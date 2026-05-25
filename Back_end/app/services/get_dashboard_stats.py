from app.database import db
from flask import abort
from app.models.Demande import Demande
from app.models.Stock import Stock
from app.models.User import User
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.LigneDemande import LigneDemande
from app.models.Demande import StatutDemande
from sqlalchemy import case
from datetime import datetime, timedelta


def get_dashboard_stats(current_user: User,current_user_entreprise ):
    total_demandes = Demande.query.filter(
        Demande.departement_id == current_user.departement_id,
        Demande.entreprise_id == current_user_entreprise.entreprise_id
    ).count()

    print(f"Total demandes pour le département {current_user.departement_id}: {total_demandes}")
    
    total_demandes_en_cours = Demande.query.filter(
        Demande.departement_id == current_user.departement_id,
        Demande.entreprise_id == current_user_entreprise.entreprise_id,
        Demande.statut == StatutDemande.EN_ATTENTE_STOCK
    ).count()

    total_demandes_approuvees = Demande.query.filter(
        Demande.departement_id == current_user.departement_id,
        Demande.entreprise_id == current_user_entreprise.entreprise_id,
        Demande.statut == StatutDemande.APPROUVEE1
    ).count()

    total_demandes_rejetees = Demande.query.filter(
        Demande.departement_id == current_user.departement_id,
        Demande.entreprise_id == current_user_entreprise.entreprise_id,
        Demande.statut == StatutDemande.REJETEE1
    ).count()

    total_materiels_stock = Stock.query.filter(
        Stock.departement_id == current_user.departement_id,
        Stock.entreprise_id == current_user_entreprise.entreprise_id
    ).count()
    print(f"Total matériels en stock pour le département {current_user.departement_id}: {total_materiels_stock}")

    total_materiels_stock_seuil = Stock.query.filter(
        Stock.departement_id == current_user.departement_id,
        Stock.entreprise_id == current_user_entreprise.entreprise_id,
        Stock.quantite_actuelle < Stock.seuil_alerte
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

    results = {
        "total_demandes": total_demandes,
        "total_demandes_en_cours": total_demandes_en_cours,
        "demandes_approuvees": total_demandes_approuvees,
        "total_demandes_rejetées": total_demandes_rejetees,
        "total_materiels": total_materiels_stock,
        "activite_hebdo": activite_hebdo,
        "alertes_stock": total_materiels_stock_seuil
    }

    return results
