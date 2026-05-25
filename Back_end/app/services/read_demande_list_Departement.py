from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.User import User
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.LigneDemande import LigneDemande
from sqlalchemy import case


def read_demande_list_departement(current_user: User, current_user_entreprise):
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
            Demande.date_soumission,
            Departement.nom.label("departement"),
            Materiel.designation.label("materiels"),
            Demande.date_traitement
        )
        .join(User, Demande.demandeur_id == User.id)
        .join(LigneDemande, Demande.id == LigneDemande.demande_id)
        .join(Materiel, LigneDemande.materiel_id == Materiel.id)
        .join(Departement, Demande.departement_id == Departement.id)
        .filter(Demande.departement_id == current_user.departement_id)
        .filter(Demande.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    # if not results:
    #     abort(404, description="Aucune demande trouvée pour ce département.")

    return [dict(row._mapping) for row in results]

def read_demande_global(current_user: User, current_user_entreprise: dict):
    return Demande.query.filter(Demande.departement_id == current_user.departement_id, Demande.entreprise_id == current_user_entreprise.entreprise_id).all()