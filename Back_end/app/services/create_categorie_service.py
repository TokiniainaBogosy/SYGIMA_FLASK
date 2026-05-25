from flask import abort
from app.database import db
from app.models.CategoriesMateriel import CategoriesMateriel


def create_categorie(data: dict,current_user_entreprise):
    existing = CategoriesMateriel.query.filter(
        CategoriesMateriel.nom == data.get("nom")
    ).first()

    if existing:
        abort(400, description="Cette catégorie existe déjà.")

    db_categorie = CategoriesMateriel(
        nom=data.get("nom"),
        description=data.get("description"),
        entreprise_id=current_user_entreprise.id
    )

    try:
        db.session.add(db_categorie)
        db.session.commit()
        db.session.refresh(db_categorie)
        return db_categorie
    except Exception as e:
        db.session.rollback()
        abort(500, description="Erreur interne lors de l'insertion en base de données")