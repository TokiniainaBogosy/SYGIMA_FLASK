from app.database import db
from app.models.Materiel import Materiel
from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.Departement import Departement


def read_materiel_list(current_user_entreprise: dict):
    results = (
        db.session.query(
            Materiel.id,
            Materiel.reference,
            Materiel.designation,
            Materiel.unite,
            Departement.nom.label("departement"),
            CategoriesMateriel.nom.label("categorie"),
            CategoriesMateriel.description.label("categorie_description")
        )
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .join(Departement, Materiel.departement_id == Departement.id)
        .filter(CategoriesMateriel.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )

    return [dict(row._mapping) for row in results]