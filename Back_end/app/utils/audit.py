from app.models.HistoriqueAction import HistoriqueAction  
from app.extensions import db  

def inscrire_historique(action: str, objet_cible, user_id: int, entreprise_id: int, details: dict = None):
    """
    Enregistre une action dans la table historique de manière explicite.
    """
    print('1111111111111')
    log = HistoriqueAction(
        entreprise_id=entreprise_id,
        user_id=user_id,
        action=action,
        table_cible=objet_cible.__tablename__,
        id_cible=objet_cible.id,
        details=details
    )
    print('2222222222222')
    db.session.add(log)
    db.session.commit()
    print('5555555555555555')