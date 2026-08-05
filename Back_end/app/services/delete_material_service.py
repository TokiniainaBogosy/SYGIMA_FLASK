from flask import abort
from app.database import db
from app.models.Materiel import Materiel


def delete_materiel(materiel_id: int):

    # 1. Rechercher l'objet en base de données
    db_materiel = Materiel.query.filter(Materiel.id == materiel_id).first()

    # 2. Vérifier s'il existe
    # if not db_materiel:
    #     abort(404, description=f"Le matériel avec l'id {materiel_id} n'existe pas.")

    # 3. Supprimer l'objet
    db.session.delete(db_materiel)

    # 4. Valider la transaction
    try:
        db.session.commit()
        return db_materiel  # Retourner l'objet supprimé pour l'historique
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la suppression.")