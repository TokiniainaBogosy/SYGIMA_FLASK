from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.User import User
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.LigneDemande import LigneDemande
from sqlalchemy import case


def read_demande_list_departement(current_user: User):
    results = (
        db.session.query(
            Demande.id,
            LigneDemande.id.label("ligne_id"),
            LigneDemande.qte_accordee,
            case(
                (LigneDemande.qte_accordee >= 1, "APPROUVEE"),
                (LigneDemande.qte_accordee == 0, "REFUSEE"),
                else_="EN_ATTENTE"
            ).label("statut_ligne"),
            Demande.reference,
            User.nom.label("demandeur"),
            Demande.statut,
            Demande.date_soumission.label("date"),
            Departement.nom.label("departement"),
            Materiel.designation.label("materiels")
        )
        .join(User, Demande.demandeur_id == User.id)
        .join(LigneDemande, Demande.id == LigneDemande.demande_id)
        .join(Materiel, LigneDemande.materiel_id == Materiel.id)
        .join(Departement, Demande.departement_id == Departement.id)
        .filter(Demande.departement_id == current_user.departement_id)
        .all()
    )

    # if not results:
    #     abort(404, description="Aucune demande trouvée pour ce département.")

    return [dict(row._mapping) for row in results]