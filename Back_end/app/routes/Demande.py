from flask import Blueprint, request, jsonify
from app.models.User import User
from app.schemas.departement import DepartementCreateSchema, DepartementBaseSchema
from app.schemas.userEntreprise import UserEntrepriseCreateSchema
from app.services.create_departement_service import create_departement
from app.services.read_departement_service import read_departement
from app.utils.auth import get_current_user_entreprise

departement_bp = Blueprint("departement", __name__, url_prefix="/departement")


@departement_bp.route("/", methods=["POST"])
def create_departement_route():
    current_user = get_current_user_entreprise()
    data = DepartementCreateSchema().load(request.get_json())
    result = create_departement(data, current_user)
    return jsonify(DepartementBaseSchema().dump(result)), 201


@departement_bp.route("/", methods=["GET"])
def read_departement_route():
    current_user = get_current_user_entreprise()
    result = read_departement(current_user)
    return jsonify(DepartementBaseSchema(many=True).dump(result)), 200
