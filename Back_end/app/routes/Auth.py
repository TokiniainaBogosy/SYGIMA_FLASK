from datetime import timedelta
from flask import Blueprint, request, jsonify, abort
from app.core.security import HashHelper, create_access_token
from app.models.User import User, RoleUser
from app.models.UserEntreprise import UserEntreprise
from app.models.Departement import Departement
from app.schemas.user import UserLoginSchema, UserResponseSchema, TokenSchema, UserCreateSchema
from app.database import db
from flask_cors import cross_origin

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    """Login avec email + password"""
    credentials = UserLoginSchema().load(request.get_json())

    # 1. Vérifier les credentials
    user = User.query.filter(User.email == credentials.get("email")).first()
    if not user or not HashHelper.verify_password(credentials.get("password"), user.password_hash):
        abort(401, description="Email ou mot de passe incorrect")

    # 2. Vérifier que le compte est actif
    if not user.is_active:
        abort(403, description="Compte désactivé")

    # 3. Récupérer l'entreprise active de l'utilisateur
    lien = UserEntreprise.query.filter(
        UserEntreprise.user_id == user.id,
        UserEntreprise.is_active == True
    ).first()

    if not lien:
        abort(403, description="Aucune entreprise active associée à ce compte.")

    # 4. Créer le token JWT
    from flask import current_app
    user_role = user.role.value if user.role else "EMPLOYE"

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user_role,
            "entreprise_id": lien.entreprise_id,
            "departement_id": user.departement_id,
        },
        expires_delta=timedelta(seconds=current_app.config["JWT_ACCESS_TOKEN_EXPIRES"])
    )

    # CORRECTION : Passer l'objet 'user' brut, pas le résultat de dump()
    return jsonify(TokenSchema().dump({
        "access_token": access_token,
        "token_type": "bearer",
        "user": user  # <-- L'objet SQLAlchemy brut suffit ici
    })), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    """Créer un nouvel utilisateur — réservé à l'interface admin"""
    user_data = UserCreateSchema().load(request.get_json())

    # 1. Vérifier unicité email
    if User.query.filter(User.email == user_data.get("email")).first():
        abort(400, description="Email déjà utilisé")

    # 2. Vérifier que le département existe
    departement = Departement.query.filter(
        Departement.nom == user_data.get("departement_id")
    ).first()
    if not departement:
        abort(404, description=f"Le département '{user_data.get('departement_id')}' n'existe pas.")

    # 3. Créer l'utilisateur
    new_user = User(
        email=user_data.get("email"),
        nom=user_data.get("nom"),
        prenom=user_data.get("prenom"),
        password_hash=HashHelper.get_password_hash(user_data.get("password")),
        role=RoleUser[user_data.get("role", "employe").upper()],
        departement_id=departement.id,
        is_active=True,
    )
    db.session.add(new_user)
    db.session.flush()
    
    if new_user.role == RoleUser.RESPONSABLE:
        # Si l'utilisateur est un responsable, on crée aussi une entrée dans ResponsableDepartement
        from app.models.ResponsableDepartement import ResponsableDepartement
        responsable = ResponsableDepartement(
            user_id=new_user.id,
            departement_id=departement.id
        )
        db.session.add(responsable)

    # 4. Lier à l'entreprise du département
    lien = UserEntreprise(
        user_id=new_user.id,
        entreprise_id=departement.entreprise_id,
        role_entreprise=user_data.get("role"),
        is_active=True,
    )
    db.session.add(lien)

    try:
        db.session.commit()
        db.session.refresh(new_user)
        return jsonify(UserResponseSchema().dump(new_user)), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la création de l'utilisateur")