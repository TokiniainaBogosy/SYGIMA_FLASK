from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.LigneDemande import LigneDemande
from app.models.Materiel import Materiel
from app.models.User import User
from app.models.Departement import Departement
from app.models.ResponsableDepartement import ResponsableDepartement
import uuid


def create_demande(data: dict, current_user: User):
    results = (
        db.session.query(
            User.id,
            Departement.id.label("departement_id"),
            ResponsableDepartement.id.label("responsable_id")
        )
        .join(Departement, Departement.id == User.departement_id)
        .join(ResponsableDepartement, ResponsableDepartement.departement_id == Departement.id)
        .filter(User.id == current_user.id)
        .first()
    )

    if not results:
         abort(404, description="Département ou responsable introuvable")

    try:
        db_demande = Demande(
            reference=f"DEM-{uuid.uuid4().hex[:8].upper()}",
            justification=data.get("justification"),
            demandeur_id=current_user.id,
            departement_id=current_user.departement_id,
            responsable_id=results.responsable_id,
            statut="SOUMISE"
        )
        db.session.add(db_demande)
        db.session.flush()  # Récupère l'ID sans valider la transaction globale

        for item in data.get("lignes", []):
            materiel = Materiel.query.filter(
                Materiel.designation == item.get("type_materiel")
            ).first()

            if not materiel:
                continue  # Ignore si le matériel n'existe pas

            db_ligne = LigneDemande(
                demande_id=db_demande.id,
                materiel_id=materiel.id,
                qte_demandee=item.get("quantite")
            )
            db.session.add(db_ligne)

        db.session.commit()
        db.session.refresh(db_demande)
        return db_demande

    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la création de la demande")