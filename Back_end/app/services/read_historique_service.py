from app.models.User import User
from app.database import db
from app.models.HistoriqueAction import HistoriqueAction


def read_historique_service(current_user: dict):
    historique =(
        db.session.query(
            HistoriqueAction.id,
            HistoriqueAction.action,
            HistoriqueAction.table_cible,
            HistoriqueAction.created_at,
            HistoriqueAction.details,
            User.nom.label("utilisateur")
        )
        .join(User, HistoriqueAction.user_id == User.id)
        .filter(HistoriqueAction.entreprise_id == current_user.entreprise_id).all()
    ) 

    return historique

