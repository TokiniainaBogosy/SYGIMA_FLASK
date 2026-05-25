from app.models.CategoriesMateriel import CategoriesMateriel


def read_categorie_list(current_user_entreprise: dict):
    categories = CategoriesMateriel.query.filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id).all()
    return categories