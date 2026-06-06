from flask import Blueprint, jsonify
from app.schemas.responsableDepartement import ResponsableDepartementResponseSchema, ResponsableDepartementCreateSchema
from app.services.read_responsable_service import read_responsable
from app.utils.auth import get_current_user

responsable_bp = Blueprint("responsable", __name__, url_prefix="/responsable")


@responsable_bp.route("/", methods=["GET"])
def read_responsable_departement():
    current_user = get_current_user()
    result = read_responsable(current_user)
    return jsonify(ResponsableDepartementResponseSchema(many=True).dump(result)), 200