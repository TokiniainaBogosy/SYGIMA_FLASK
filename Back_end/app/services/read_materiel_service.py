from flask import abort
from app.database import db
from app.models.Materiel import Materiel
from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.Departement import Departement


def read_materiel(user_entreprise: dict):
    materiels = Materiel.query.filter(Materiel.entreprise_id == user_entreprise.entreprise_id).all()
    # if not materiels:
    #     abort(404, description="Il n'y a aucun matériel.")
    return materiels


def read_materiel_list(current_user_entreprise):
    results = (
        db.session.query(
            Materiel.id,
            Materiel.reference,
            Materiel.designation,
            Materiel.unite,
            Departement.nom.label("departement"),
            CategoriesMateriel.nom.label("categorie"),
            CategoriesMateriel.entreprise_id,
            CategoriesMateriel.description.label("categorie_description")
        )
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .join(Departement, Materiel.departement_id == Departement.id)
        .filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )
    print(results)
    return [dict(row._mapping) for row in results]