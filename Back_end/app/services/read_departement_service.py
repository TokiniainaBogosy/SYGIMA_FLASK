from flask import abort
from app.models.User import User
from app.database import db
from app.models.Departement import Departement
from app.models.ResponsableDepartement import ResponsableDepartement
from sqlalchemy import alias

def read_departement(current_user: dict):
    departements = Departement.query.filter(
        Departement.entreprise_id == current_user.entreprise_id
    ).all()

    # if not departements:
    #     abort(404, description="Il n'y a aucun département.")

    return departements

def read_departement_and_responsable(current_user: dict):
    results = (
        db.session.query(
            Departement.id,
            Departement.nom,
            Departement.code,
            User.nom.label("responsable_nom"),
        )
        .outerjoin(ResponsableDepartement, ResponsableDepartement.departement_id == Departement.id)
        .outerjoin(User, ResponsableDepartement.user_id == User.id)
        .filter(Departement.entreprise_id == current_user.entreprise_id)
        .all()
    )

    return [dict(row._mapping) for row in results]