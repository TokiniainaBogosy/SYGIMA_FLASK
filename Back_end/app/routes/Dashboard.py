from flask import Blueprint, request, jsonify, send_file
from app.utils.auth import get_current_user, get_current_user_entreprise
from app.services.get_dashboard_stats import get_dashboard_stats
from app.services.get_dashboard_stats import get_dashboard_stats
from app.services.pdf.dashboard_pdf_service import generate_dashboard_pdf
from app.services.read_demande_list_Departement import read_demande_list_departement
dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/stats", methods=["GET"])
def get_dashboard_stats_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    stats = get_dashboard_stats(current_user, current_user_entreprise)
    return jsonify(stats), 200

@dashboard_bp.route("/pdf", methods=["GET"])
def dashboard_pdf():

    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    # Récupération des statistiques du département
    stats = get_dashboard_stats(
        current_user,
        current_user_entreprise
    )

    # Département
    departement = current_user.departement

    # Entreprise
    entreprise = current_user_entreprise.entreprise

    # # Récupération des demandes du département
    # demandes = read_demande_list_departement(
    #     current_user,
    #     current_user_entreprise
    # )

    # Génération du PDF
    pdf = generate_dashboard_pdf(
        stats=stats,
        entreprise_nom=entreprise.nom,
        departement_nom=(
            departement.nom
            if departement
            else "Non attribué"
        )
    )

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="rapport_dashboard.pdf"
    )