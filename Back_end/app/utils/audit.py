from app.models.HistoriqueAction import HistoriqueAction
from app.extensions import db


def inscrire_historique(action: str, objet_cible, user_id: int, entreprise_id: int, details: dict = None):
    """
    Enregistre une action dans la table historique de manière explicite.
    """
    if objet_cible is None:
        return

    log = HistoriqueAction(
        entreprise_id=entreprise_id,
        user_id=user_id,
        action=action,
        table_cible=objet_cible.__tablename__,
        id_cible=objet_cible.id,
        details=details or {}
    )
    db.session.add(log)
    db.session.commit()