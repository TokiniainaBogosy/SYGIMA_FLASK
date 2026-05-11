from flask import abort
from app.database import db
from app.models.Entreprise import Entreprise
from app.models.User import User, RoleUser
from app.models.UserEntreprise import UserEntreprise
from app.core.security import HashHelper


def setup_entreprise_et_admin(payload: dict):

    # 1. Vérification unicité code entreprise
    # if Entreprise.query.filter(Entreprise.code == payload["entreprise"]["code"]).first():
    #     abort(400, description="Une entreprise avec ce code existe déjà.")

    # 2. Vérification unicité email admin
    # if User.query.filter(User.email == payload["admin"]["email"]).first():
    #     abort(400, description="Cet email est déjà utilisé par un autre utilisateur.")

    try:
        # 3. Création de l'entreprise
        new_ent = Entreprise(
            nom=payload["entreprise"]["nom"],
            code=payload["entreprise"]["code"],
            adresse=payload["entreprise"].get("adresse"),
            logo_url=payload["entreprise"].get("logo_url")
        )
        db.session.add(new_ent)
        db.session.flush()  # génère new_ent.id sans commit

        # 4. Création de l'admin
        new_admin = User(
            nom=payload["admin"]["nom"],
            prenom=payload["admin"]["prenom"],
            email=payload["admin"]["email"],
            password_hash=HashHelper.get_password_hash(payload["admin"]["password"]),
            role=RoleUser.ADMIN,
        )
        db.session.add(new_admin)
        db.session.flush()  # génère new_admin.id

        # 5. Liaison User ↔ Entreprise via UserEntreprise
        lien = UserEntreprise(
            user_id=new_admin.id,
            entreprise_id=new_ent.id,
            role_entreprise=RoleUser.ADMIN.value,
            is_active=True
        )
        db.session.add(lien)

        # 6. Validation finale
        db.session.commit()
        db.session.refresh(new_ent)

        return {
            "status": "success",
            "message": "Entreprise et compte administrateur configurés.",
            "entreprise_id": new_ent.id
        }

    except Exception as e:
        db.session.rollback()
        print(f"Erreur Setup: {str(e)}")
        abort(500, description="Erreur interne lors de la configuration.")