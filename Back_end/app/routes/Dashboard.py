from flask import Blueprint, request, jsonify
from app.utils.auth import get_current_user, get_current_user_entreprise
from app.services.get_dashboard_stats import get_dashboard_stats
dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/stats", methods=["GET"])
def get_dashboard_stats_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    stats = get_dashboard_stats(current_user, current_user_entreprise)
    return jsonify(stats), 200