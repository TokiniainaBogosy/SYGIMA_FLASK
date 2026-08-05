from flask import abort
from app.database import db
from app.models.Materiel import Materiel
from app.models.CategoriesMateriel import CategoriesMateriel


def create_materiel(data: dict,current_user,current_user_entreprise):
    existing = Materiel.query.filter(Materiel.reference == data.get("reference")).first()
    # if existing:
    #     abort(400, description="Ce matériel existe déjà.")

    categorie = CategoriesMateriel.query.filter(
        CategoriesMateriel.nom == data.get("categorie")
    ).first()
    # if not categorie:
    #     abort(404, description=f"La catégorie '{data.get('categorie')}' n'existe pas.")

    db_materiel = Materiel(
        reference=data.get("reference"),
        designation=data.get("designation"),
        categorie_id=categorie.id,
        sous_categorie=data.get("sous_categorie"),
        unite=data.get("unite"),
        departement_id=current_user.departement_id,
        entreprise_id=current_user_entreprise.entreprise_id
    )

    try:
        db.session.add(db_materiel)
        db.session.commit()
        db.session.refresh(db_materiel)
        return db_materiel
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur interne lors de l'insertion en base de données")