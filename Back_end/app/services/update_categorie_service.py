from flask import abort
from app.database import db
from app.models.CategoriesMateriel import CategoriesMateriel


def update_categorie(categorie_id: int, data: dict):

    # 1. Chercher l'existant
    db_obj = CategoriesMateriel.query.filter(CategoriesMateriel.id == categorie_id).first()

    if not db_obj:
        abort(404, description="Catégorie non trouvée")

    # 2. Appliquer les changements dynamiquement (on ignore ce qui est None)
    for field, value in data.items():
        if value is not None:
            setattr(db_obj, field, value)

    # 3. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour.")