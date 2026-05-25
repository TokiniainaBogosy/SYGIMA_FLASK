from app.database import db
from app.models.Stock import Stock
from app.models.Materiel import Materiel
from app.models.Departement import Departement
from app.models.CategoriesMateriel import CategoriesMateriel
from app.models.User import User


def read_stock_list(current_user: User,current_user_entreprise: dict):
    results = (
        db.session.query(
            Stock.id,
            Stock.materiel_id,
            Materiel.reference,
            Materiel.designation,
            CategoriesMateriel.nom.label("categorie"),
            Stock.quantite_actuelle,
            Stock.seuil_alerte,
            Departement.nom.label("departement")
        )
        .join(Materiel, Stock.materiel_id == Materiel.id)
        .join(CategoriesMateriel, Materiel.categorie_id == CategoriesMateriel.id)
        .join(Departement, Stock.departement_id == Departement.id)
        .filter(Stock.departement_id == current_user.departement_id)
        .filter(Stock.entreprise_id == current_user_entreprise.entreprise_id)
        .all()
    )
    print(results)
    return [dict(row._mapping) for row in results]