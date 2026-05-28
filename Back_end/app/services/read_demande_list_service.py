from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.User import User
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.LigneDemande import LigneDemande
from app.models.UserEntreprise import UserEntreprise
from sqlalchemy import case
from typing import Optional


def read_demande_list_departement(current_user: User,current_user_entreprise: dict):
    results = (
        db.session.query(
            Demande.id,
            LigneDemande.id.label("ligne_id"),
            LigneDemande.qte_accordee,
            case(
                (LigneDemande.qte_accordee >= 1, "APPROUVEE"),
                (LigneDemande.qte_accordee == 0, "REFUSEE"),
                else_="SOUMISE"
            ).label("statut_ligne"),
            Demande.reference,
            User.nom.label("demandeur"),
            Demande.statut,
            Demande.date_soumission,
            Demande.date_soumission.label("date_soumission"),
            Demande.date_traitement,
            Demande.entreprise_id,
            Departement.nom.label("departement"),
            Materiel.designation.label("materiels")
        )
        .join(User, Demande.demandeur_id == User.id)
        .join(UserEntreprise, User.id == UserEntreprise.user_id)
        .join(LigneDemande, Demande.id == LigneDemande.demande_id)
        .join(Materiel, LigneDemande.materiel_id == Materiel.id)
        .join(Departement, Demande.departement_id == Departement.id)
        .filter(Demande.departement_id == current_user.departement_id,Demande.entreprise_id == current_user_entreprise.entreprise_id)
        .filter(Demande.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    # if not results:
    #     abort(404, description="Aucune demande trouvée pour ce département.")

    return [dict(row._mapping) for row in results]


def read_demande_list(current_user: User, current_user_entreprise: dict, limit: Optional[int] = None):
    query = (
        db.session.query(
            Demande.id,
            LigneDemande.id.label("ligne_id"),
            LigneDemande.qte_accordee,
            case(
                (LigneDemande.qte_accordee >= 1, "APPROUVEE"),
                (LigneDemande.qte_accordee == 0, "REJETEE"),
                else_="EN_ATTENTE"
            ).label("statut_ligne"),
            Demande.reference,
            User.nom.label("demandeur"),
            Demande.statut,
            Demande.date_soumission,
            Demande.date_soumission.label("date"),
            Demande.date_traitement,
            Departement.nom.label("departement"),
            Materiel.designation.label("materiels"),
            Demande.entreprise_id
        )
        .join(User, Demande.demandeur_id == User.id)
        .join(LigneDemande, Demande.id == LigneDemande.demande_id)
        .join(Materiel, LigneDemande.materiel_id == Materiel.id)
        .join(Departement, Demande.departement_id == Departement.id)
        .filter(Demande.entreprise_id == current_user_entreprise.entreprise_id)
        .order_by(Demande.date_soumission.desc())
    )

    if limit is not None:
        query = query.limit(limit)

    results = query.all()
    return [dict(row._mapping) for row in results]