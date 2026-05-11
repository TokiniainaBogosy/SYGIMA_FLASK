from app.models.CategoriesMateriel import CategoriesMateriel


def read_categorie_list():
    return CategoriesMateriel.query.all()