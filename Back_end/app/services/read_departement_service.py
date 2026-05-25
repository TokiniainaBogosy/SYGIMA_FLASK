from flask import abort
from app.database import db
from app.models.Departement import Departement


def read_departement(current_user: dict):
    departements = Departement.query.filter(
        Departement.entreprise_id == current_user.entreprise_id
    ).all()

    # if not departements:
    #     abort(404, description="Il n'y a aucun département.")

    return departements