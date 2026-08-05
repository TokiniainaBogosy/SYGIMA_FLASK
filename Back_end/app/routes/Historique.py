from flask import Blueprint, jsonify
from app.schemas.historique import HistoriqueActionResponseSchema
from app.services.read_historique_service import read_historique_service
from app.utils.auth import get_current_user_entreprise, get_current_user

historique_bp = Blueprint("historique", __name__, url_prefix="/historique")


@historique_bp.route("/", methods=["GET"])
def read_historique():
    current_user = get_current_user_entreprise()
    result = read_historique_service(current_user)
    return jsonify(HistoriqueActionResponseSchema(many=True).dump(result)), 200