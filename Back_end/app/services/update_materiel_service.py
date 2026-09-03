from flask import abort
from app.database import db
from app.models.Materiel import Materiel
from app.models.CategoriesMateriel import CategoriesMateriel


def update_materiel(materiel_id: int, data: dict):

    # 1. Chercher l'existant
    db_obj = Materiel.query.filter(Materiel.id == materiel_id).first()

    if not db_obj:
        abort(404, description="Matériel non trouvé")

    # 2. Résoudre la catégorie par nom si fournie
    if data.get("categorie"):
        db_categorie = CategoriesMateriel.query.filter(
            CategoriesMateriel.nom == data.get("categorie")
        ).first()
        if db_categorie:
            db_obj.categorie_id = db_categorie.id
        data.pop("categorie")  # éviter d'écraser avec la valeur string

    # 3. Appliquer les changements dynamiquement (on ignore ce qui est None)
    for field, value in data.items():
        if value is not None:
            setattr(db_obj, field, value)

    # 4. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour.")