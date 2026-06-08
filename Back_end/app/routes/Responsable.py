from flask import Blueprint, jsonify, request
from app.schemas.responsableDepartement import ResponsableDepartementResponseSchema, ResponsableDepartementUpdateSchema
from app.services.read_responsable_service import read_responsable
from app.services.update_responsable_service import update_responsable
from app.utils.auth import get_current_user_entreprise, get_current_user

responsable_bp = Blueprint("responsable", __name__, url_prefix="/responsable")


@responsable_bp.route("/", methods=["GET"])
def read_responsable_departement():
    current_user = get_current_user()
    result = read_responsable(current_user)
    return jsonify(ResponsableDepartementResponseSchema(many=True).dump(result)), 200

@responsable_bp.route("/", methods=["PATCH"])
def update_responsable_departement():
    current_user = get_current_user_entreprise()
    data = ResponsableDepartementUpdateSchema().load(request.get_json())
    result = update_responsable(data, current_user)
    return jsonify(ResponsableDepartementResponseSchema().dump(result)), 201