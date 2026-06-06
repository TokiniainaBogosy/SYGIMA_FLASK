from app.database import db
from app.models.User import User
from app.models.Departement import Departement


def read_user_list(current_user: User, current_user_entreprise: dict,departement_id : int):
    results = (
        db.session.query(
            User.id,
            User.nom,
            User.prenom,
            User.email,
            User.role,
            User.is_active,
            User.created_at,
            Departement.nom.label("departement")
        )
        .join(Departement, Departement.id == User.departement_id)  
        .filter(Departement.entreprise_id == current_user_entreprise.entreprise_id)
        .filter(Departement.id == departement_id)
        .all()
    )

    return [dict(row._mapping) for row in results]