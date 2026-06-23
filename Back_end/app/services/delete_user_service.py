from flask import abort
from app.database import db
from app.models.User import User


def delete_user(user_id: int):

    # 1. Rechercher l'objet en base de données
    db_user = User.query.filter(User.id == user_id).first()

    # 2. Vérifier s'il existe
    # if not db_materiel:
    #     abort(404, description=f"Le matériel avec l'id {materiel_id} n'existe pas.")

    # 3. Supprimer l'objet
    db.session.delete(db_user)

    # 4. Valider la transaction
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la suppression.")