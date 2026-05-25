from flask import abort
from app.models.CategoriesMateriel import CategoriesMateriel


def read_categorie(current_user_entreprise):
    categories = CategoriesMateriel.query.filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id).all()
    print(categories)
    # if not categories:
    #     abort(404, description="Il n'y a aucune catégorie.")
    return categories


def read_categorie_list(current_user_entreprise: dict):
    categories = CategoriesMateriel.query.filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id).all()
    return categories