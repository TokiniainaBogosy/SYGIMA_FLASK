from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.database import db


def read_categorie(current_user_entreprise):
    categories = CategoriesMateriel.query.filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id).all()
    
    # if not categories:
    #     abort(404, description="Il n'y a aucune catégorie.")
    return categories

def read_categorie_par_admin(current_user_entreprise):
    results = (
        db.session.query(
            CategoriesMateriel.id,
            Departement.nom.label("departement"),
            CategoriesMateriel.nom.label("categorie"),
            CategoriesMateriel.description.label("categorie_description")
        )
        .select_from(Materiel)
        .join(Departement, Materiel.departement_id == Departement.id)
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )
    return [dict(row._mapping) for row in results]


def read_categorie_list(current_user_entreprise: dict):
    categories = CategoriesMateriel.query.filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id).all()
    return categories