from app.database import db
from app.models.Materiel import Materiel
from app.models.CategoriesMateriel import CategoriesMateriel


def read_materiel_list():
    results = (
        db.session.query(
            Materiel.id,
            Materiel.reference,
            Materiel.designation,
            Materiel.unite,
            CategoriesMateriel.nom.label("categorie"),
        )
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .all()
    )

    return [dict(row._mapping) for row in results]