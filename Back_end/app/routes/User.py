from flask import Blueprint, jsonify
from app.schemas.user import UserListResponseSchema
from app.services.read_user_list_service import read_user_list
from app.utils.auth import get_current_user

user_bp = Blueprint("user", __name__, url_prefix="/user")


@user_bp.route("/", methods=["GET"])
def read_user_list_route():
    current_user = get_current_user()
    result = read_user_list(current_user)
    return jsonify(UserListResponseSchema(many=True).dump(result)), 200