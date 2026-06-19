from flask import Blueprint, jsonify
from app.schemas.user import UserListResponseSchema
from app.services.read_user_list_service import read_user_list,read_user_entreprise_list
from app.utils.auth import get_current_user, get_current_user_entreprise

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route("/<int:departement_id>", methods=["GET"])
def read_user_list_route(departement_id : int):
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_user_list(current_user, current_user_entreprise, departement_id)
    return jsonify(UserListResponseSchema(many=True).dump(result)), 200

@user_bp.route("/",methods=["GET"])
def read_user_par_entreprise_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_user_entreprise_list(current_user, current_user_entreprise)
    return jsonify(UserListResponseSchema(many=True).dump(result)), 200