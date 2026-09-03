from flask import abort
from app.database import db
from app.models.User import User
from app.models.UserEntreprise import UserEntreprise
from app.models.Departement import Departement
from app.core.security import HashHelper


def create_user(data: dict, current_user):

    # 1. Vérifier que le département existe
    departement = Departement.query.filter(
        Departement.nom == data.get("departement")
    ).first()
    # if not departement:
    #     abort(404, description=f"Le département '{data.get('departement')}' n'existe pas.")

    # 2. Vérifier que l'email n'est pas déjà utilisé
    if User.query.filter(User.email == data.get("email")).first():
        abort(400, description="Cet email est déjà utilisé.")

    # 3. Création de l'utilisateur
    db_user = User(
        nom=data.get("nom"),
        prenom=data.get("prenom"),
        email=data.get("email"),
        password_hash=HashHelper.get_password_hash(data.get("password")),
        role=data.get("role", "employe"),
        departement_id=departement.id
    )
    db.session.add(db_user)
    db.session.flush()  # génère db_user.id sans commit

    # 4. Liaison User ↔ Entreprise via UserEntreprise
    lien = UserEntreprise(
        user_id=db_user.id,
        entreprise_id=current_user.entreprise_id,
        role_entreprise=db_user.role,
        is_active=True
    )
    db.session.add(lien)

    try:
        db.session.commit()
        db.session.refresh(db_user)
        return db_user
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(400, description="Erreur lors de la création de l'utilisateur")