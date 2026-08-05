from flask import abort
from app.database import db
from app.models.Stock import Stock


def update_stock(stock_id: int, data: dict):

    # 1. Chercher le stock
    db_obj = Stock.query.filter(Stock.id == stock_id).first()
    db_materiel = db_obj.materiel  # Accéder à l'objet Materiel associé
    if not db_obj:
        abort(404, description="Stock non trouvé")

    # 2. Mettre à jour quantite_actuelle
    nouvelle_quantite = data.get("quantite_actuelle")

    if nouvelle_quantite is None:
        abort(400, description="Le champ 'quantite_actuelle' est requis.")

    if nouvelle_quantite < 0:
        abort(400, description="La quantité ne peut pas être négative.")

    # 3. Vérifier qu'on ne dépasse pas le stock disponible (cas réduction)
    if nouvelle_quantite > db_obj.quantite_actuelle:
        # C'est une addition → OK
        pass
    elif nouvelle_quantite < 0:
        abort(400, description="Stock insuffisant.")

    db_obj.quantite_actuelle = nouvelle_quantite

    # 4. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj,db_materiel  # Retourner l'objet mis à jour pour l'historique
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour du stock.")