from flask import abort
from app.database import db
from app.models.InventaireMaterielEmploye import InventaireEmploye
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.User import User
from app.models.Stock import Stock


def read_inventaire():
    inventaires = InventaireEmploye.query.all()
    if not inventaires:
        abort(404, description="Il n'y a aucun inventaire.")
    return inventaires


def read_inventaire_list(current_user: User, current_user_entreprise):
    results = (
        db.session.query(
            InventaireEmploye.id,
            InventaireEmploye.materiel_id,
            InventaireEmploye.quantite,
            InventaireEmploye.updated_at,
            Materiel.reference,
            Materiel.designation,
            Materiel.unite,
            Materiel.sous_categorie,
            Stock.seuil_alerte,
            CategoriesMateriel.nom.label("categorie"),
            Departement.nom.label("departement"),
            User.nom.label("employe_nom"),
            User.prenom.label("employe_prenom"),
        )
        .join(Materiel, InventaireEmploye.materiel_id == Materiel.id)
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .join(Departement, InventaireEmploye.departement_id == Departement.id)
        .join(User, InventaireEmploye.user_id == User.id)
        .join(Stock, InventaireEmploye.materiel_id == Stock.materiel_id)
        .filter(InventaireEmploye.departement_id == current_user.departement_id)
        .filter(InventaireEmploye.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    if not results:
        abort(404, description="Aucun inventaire trouvé pour ce département.")

    return [ {
        **dict(row._mapping),
        "sous_categorie": row.sous_categorie.value
    } for row in results]

def read_inventaire_list_par_admin(current_user_entreprise):
    results = (
        db.session.query(
            InventaireEmploye.id,
            InventaireEmploye.materiel_id,
            InventaireEmploye.quantite,
            InventaireEmploye.updated_at,
            Materiel.reference,
            Materiel.designation,
            Materiel.sous_categorie,
            Materiel.unite,
            Stock.seuil_alerte,
            CategoriesMateriel.nom.label("categorie"),
            Departement.nom.label("departement"),
            User.nom.label("employe_nom"),
            User.prenom.label("employe_prenom"),
        )
        .join(Materiel, InventaireEmploye.materiel_id == Materiel.id)
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .join(Departement, InventaireEmploye.departement_id == Departement.id)
        .join(User, InventaireEmploye.user_id == User.id)
        .join(Stock, InventaireEmploye.materiel_id == Stock.materiel_id)
        .filter(InventaireEmploye.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    if not results:
        abort(404, description="Aucun inventaire trouvé pour cette entreprise.")

    return [ {
        **dict(row._mapping),
        "sous_categorie": row.sous_categorie.value
    } for row in results]


def read_inventaire_employe(current_user: User, current_user_entreprise):
    """Inventaire personnel de l'employé connecté"""
    results = (
        db.session.query(
            InventaireEmploye.id,
            InventaireEmploye.materiel_id,
            InventaireEmploye.quantite,
            InventaireEmploye.updated_at,
            Materiel.reference,
            Materiel.designation,
            Materiel.unite,
            Stock.seuil_alerte,
            CategoriesMateriel.nom.label("categorie"),
        )
        .join(Materiel, InventaireEmploye.materiel_id == Materiel.id)
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .filter(InventaireEmploye.user_id == current_user.id)
        .filter(InventaireEmploye.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    if not results:
        abort(404, description="Aucun inventaire trouvé pour cet employé.")

    return [dict(row._mapping) for row in results]