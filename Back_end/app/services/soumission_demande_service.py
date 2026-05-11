from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.User import User


def create_demande_simple(data: dict):

    user = User.query.filter(User.id == data.get("user_id")).first()
    if not user:
        abort(404, description="User introuvable")

    demande = Demande(
        demandeur_id=data.get("demandeur_id"),
        departement_id=data.get("departement_id"),
        responsable_id=data.get("responsable_id"),
        date_soumission=data.get("date_soumission")
    )

    try:
        db.session.add(demande)
        db.session.commit()
        db.session.refresh(demande)
        return demande
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la création de la demande")