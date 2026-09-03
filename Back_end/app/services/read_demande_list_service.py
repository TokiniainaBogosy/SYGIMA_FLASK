from flask import abort
from app.database import db
from app.models.Demande import Demande
from app.models.User import User, RoleUser
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.LigneDemande import LigneDemande
from app.models.UserEntreprise import UserEntreprise
from app.models.Stock import Stock
from sqlalchemy import case
from typing import Optional


def read_demande_list_departement(current_user: User,current_user_entreprise: dict, departement_id: int):
    results = (
        db.session.query(
            Demande.id,
            LigneDemande.id.label("ligne_id"),
            LigneDemande.qte_accordee,
            LigneDemande.statut_ligne,
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
        .filter(Demande.departement_id == departement_id)
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
            LigneDemande.qte_demandee,
            LigneDemande.qte_accordee,
            LigneDemande.statut_ligne,
            Demande.reference,
            User.nom.label("demandeur"),
            Demande.statut,
            Demande.date_soumission,
            Demande.date_soumission.label("date"),
            Demande.date_traitement,
            Demande.justification,
            Demande.motif_rejet,
            Departement.nom.label("departement"),
            Materiel.designation.label("materiels"),
            Stock.quantite_actuelle.label("qte_disponible"),
            Demande.entreprise_id
        )
        .join(User, Demande.demandeur_id == User.id)
        .join(LigneDemande, Demande.id == LigneDemande.demande_id)
        .join(Materiel, LigneDemande.materiel_id == Materiel.id)
        .join(Departement, Demande.departement_id == Departement.id)
        .outerjoin(Stock, Stock.materiel_id == Materiel.id)
        .filter(Demande.entreprise_id == current_user_entreprise.entreprise_id)
        .order_by(Demande.date_soumission.desc())
    )

    if current_user.role == RoleUser.EMPLOYE:
        query = query.filter(Demande.demandeur_id == current_user.id)
    elif current_user.role == RoleUser.RESPONSABLE:
        query = query.filter(Demande.departement_id == current_user.departement_id)

    if limit is not None:
        query = query.limit(limit)

    results = query.all()
    return [dict(row._mapping) for row in results]