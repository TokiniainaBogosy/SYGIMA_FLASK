from flask import abort
from sqlalchemy import or_
from app.database import db
from app.models.User import User
from app.models.UserEntreprise import UserEntreprise
from app.models.ResponsableDepartement import ResponsableDepartement
from app.models.Departement import Departement


def create_departement(data: dict, current_user: UserEntreprise):

    # 1. Vérification : le département existe-t-il déjà ?
    existing = Departement.query.filter(
        or_(Departement.nom == data.get("nom"), Departement.code == data.get("code"))
    ).first()

    # if existing:
    #     abort(400, description="Un département avec ce nom ou ce code existe déjà.")

    db_departement = Departement(
        nom=data.get("nom"),
        code=data.get("code"),
        entreprise_id=current_user.entreprise_id
    )

    try:
        db.session.add(db_departement)
        db.session.commit()
        db.session.refresh(db_departement)
        return db_departement
    except Exception as e:
        db.session.rollback()
        abort(500, description="Erreur interne lors de l'insertion en base de données")


def ajout_responsable(data: dict):
    user = User.query.filter(User.nom == data.get("user_nom")).first()
    # if not user:
    #     abort(404, description="Utilisateur introuvable")

    departement = Departement.query.filter(Departement.nom == data.get("departement_nom")).first()
    # if not departement:
    #     abort(404, description="Département introuvable")

    existing = ResponsableDepartement.query.filter(
        ResponsableDepartement.departement_id == departement.id
    ).first()

    # if existing:
    #     abort(400, description="Un responsable avec ce nom ou ce code existe déjà.")

    db_responsable = ResponsableDepartement(
        user_id=user.id,
        departement_id=departement.id
    )

    try:
        db.session.add(db_responsable)
        db.session.commit()
        db.session.refresh(db_responsable)
        return db_responsable
    except Exception as e:
        db.session.rollback()
        abort(500, description="Erreur interne lors de l'insertion en base de données")