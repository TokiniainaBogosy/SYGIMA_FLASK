from flask import Blueprint, request, jsonify
from typing import Optional
from app.schemas.ligneDemande import CreateDemandeGlobalSchema
from app.schemas.demande import DemandeResponseSchema, DemandeListResponseSchema, StatusUpdateSchema
from app.services.create_demande_service import create_demande
from app.services.answer_demande_service import modifier_statut_demande
from app.services.read_demande_list_service import read_demande_list, read_demande_list_departement
from app.utils.auth import get_current_user

demande_bp = Blueprint("demande", __name__, url_prefix="/demande")


@demande_bp.route("/", methods=["POST"])
def create_demande_route():
    current_user = get_current_user()
    data = CreateDemandeGlobalSchema().load(request.get_json())
    result = create_demande(data, current_user)
    return jsonify(DemandeResponseSchema().dump(result)), 201


@demande_bp.route("/", methods=["GET"])
def read_demande_list_route():
    current_user = get_current_user()
    limit = request.args.get("limit", None, type=int)  # ← query param optionnel
    result = read_demande_list(current_user, limit)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/departement", methods=["GET"])
def read_demande_list_departement_route():
    current_user = get_current_user()
    result = read_demande_list_departement(current_user)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/answer", methods=["PATCH"])
def answer_demande_route():
    current_user = get_current_user()
    data = StatusUpdateSchema().load(request.get_json())
    result = modifier_statut_demande(data, current_user)
    return jsonify(result), 200