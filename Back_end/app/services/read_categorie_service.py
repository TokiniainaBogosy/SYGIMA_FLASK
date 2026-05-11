from flask import abort
from app.models.CategoriesMateriel import CategoriesMateriel


def read_categorie():
    categories = CategoriesMateriel.query.all()
    # if not categories:
    #     abort(404, description="Il n'y a aucune catégorie.")
    return categories


def read_categorie_list():
    return CategoriesMateriel.query.all()