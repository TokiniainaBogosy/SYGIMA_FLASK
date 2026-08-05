from flask import abort
from app.database import db
from app.models.CategoriesMateriel import CategoriesMateriel


def delete_categorie(categorie_id: int):

    # 1. Rechercher l'objet en base de données
    db_categorie = CategoriesMateriel.query.filter(
        CategoriesMateriel.id == categorie_id
    ).first()

    # 2. Vérifier s'il existe
    # if not db_categorie:
    #     abort(404, description=f"La catégorie avec l'id {categorie_id} n'existe pas.")

    # 3. Supprimer l'objet
    db.session.delete(db_categorie)

    # 4. Valider la transaction
    try:
        db.session.commit()
        return db_categorie  # Retourner l'objet supprimé pour l'historique
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la suppression.")