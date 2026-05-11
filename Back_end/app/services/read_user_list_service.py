from app.database import db
from app.models.User import User
from app.models.Departement import Departement


def read_user_list(current_user: User):
    results = (
        db.session.query(
            User.id,
            User.nom,
            User.prenom,
            User.email,
            User.role,
            User.is_active,
            User.created_at,
            Departement.nom.label("departement"),
        )
        .join(Departement, Departement.id == User.departement_id)  # ← bug corrigé (était User.id)
        .all()
    )

    return [dict(row._mapping) for row in results]