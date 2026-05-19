from flask import Blueprint, jsonify
from app.utils.auth import get_current_user

current_user_bp = Blueprint("current_user", __name__, url_prefix="/auth")


@current_user_bp.route("/me", methods=["GET"])
def read_user():
    current_user = get_current_user()

    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
        "nom": current_user.nom,
        "prenom": current_user.prenom,
        "role": current_user.role.value if hasattr(current_user.role, 'value') else current_user.role,
        "departement_id": current_user.departement_id
    }), 200