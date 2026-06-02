from flask import Blueprint, request, jsonify
from typing import Optional
from app.schemas.ligneDemande import CreateDemandeGlobalSchema
from app.schemas.demande import DemandeResponseSchema, DemandeListResponseSchema, StatusUpdateSchema
from app.services.create_demande_service import create_demande
from app.services.answer_demande_service import modifier_statut_demande
from app.services.read_demande_list_Departement import read_demande_global
from app.services.read_demande_list_service import read_demande_list, read_demande_list_departement
from app.utils.auth import get_current_user , get_current_user_entreprise


demande_bp = Blueprint("demande", __name__, url_prefix="/demande")


@demande_bp.route("/", methods=["POST"])
def create_demande_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    data = CreateDemandeGlobalSchema().load(request.get_json())
    result = create_demande(data, current_user, current_user_entreprise)
    return jsonify(DemandeResponseSchema().dump(result)), 201


@demande_bp.route("/", methods=["GET"])
def read_demande_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    limit = request.args.get("limit", None, type=int)  # ← query param optionnel
    result = read_demande_list(current_user, current_user_entreprise, limit)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/<int:departement_id>", methods=["GET"])
def read_demande_list_departement_route(departement_id: int):
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_demande_list_departement(current_user, current_user_entreprise,departement_id)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200

@demande_bp.route("/departement/global", methods=["GET"])
def read_demande_list_departement_global_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_demande_global(current_user, current_user_entreprise)
    return jsonify(result), 200


@demande_bp.route("/answer", methods=["PATCH"])
def answer_demande_route():
    current_user = get_current_user()
    data = StatusUpdateSchema().load(request.get_json())
    result = modifier_statut_demande(data, current_user)
    
    # Sérialisation propre via Marshmallow
    # Remplacez DemandeSchema par le nom de votre schéma existant
    return jsonify(DemandeListResponseSchema().dump(result)), 200