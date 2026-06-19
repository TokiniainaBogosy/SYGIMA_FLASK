from flask import request, abort
from app.core.security import decode_token
from app.models.User import User
from app.models.UserEntreprise import UserEntreprise
from flask_cors import cross_origin


def get_current_user() -> User:
    """Récupère l'utilisateur courant depuis le token JWT"""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        abort(401, description="Token manquant ou invalide")

    token = auth_header.split(" ")[1]
    payload = decode_token(token)

    if not payload:
        abort(401, description="Token invalide ou expiré")

    user_id = payload.get("sub")
    user = User.query.filter(User.id == int(user_id)).first()

    if not user:
        abort(401, description="Utilisateur non trouvé")

    return user


def get_current_user_entreprise() -> UserEntreprise:
    """Récupère le lien UserEntreprise depuis le token JWT"""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        abort(401, description="Token manquant ou invalide")

    token = auth_header.split(" ")[1]
    payload = decode_token(token)

    if not payload:
        abort(401, description="Token invalide ou expiré")

    user_id = payload.get("sub")
    user = UserEntreprise.query.filter(
        UserEntreprise.user_id == int(user_id)
    ).first()

    if not user:
        abort(401, description="Utilisateur non trouvé")

    return user