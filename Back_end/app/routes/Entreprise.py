from flask import Blueprint, request, jsonify
from app.schemas.entreprise import SetupRequestSchema, SetupResponseSchema
from app.services.create_entreprise_service import setup_entreprise_et_admin

entreprise_bp = Blueprint("entreprise", __name__, url_prefix="/entreprises")


@entreprise_bp.route("/setup-entreprise", methods=["POST"])
def create_entreprise_setup():
    data = SetupRequestSchema().load(request.get_json())
    result = setup_entreprise_et_admin(data)
    return jsonify(SetupResponseSchema().dump(result)), 201