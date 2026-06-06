from flask import abort
from app.models import User
from app.models import Departement
from app.database import db
from app.models.ResponsableDepartement import ResponsableDepartement


def read_responsable(current_user: dict):
    responsables = (
        db.session.query(
            ResponsableDepartement,
            Departement.nom.label("departement_nom"),
            User.nom.label("user_nom")
        )
        .join(Departement, ResponsableDepartement.departement_id == Departement.id)
        .join(User, ResponsableDepartement.user_id == User.id)
        .filter(
            Departement.entreprise_id == current_user.entreprise_id
        ).all()
    )

    # if not departements:
    #     abort(404, description="Il n'y a aucun département.")

    return responsables