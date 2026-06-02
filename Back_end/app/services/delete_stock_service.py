from flask import abort
from app.database import db
from app.models.Stock import Stock


def delete_stock(stock_id: int):

    # 1. Rechercher l'objet en base de données
    db_stock = Stock.query.filter(Stock.id == stock_id).first()

    # 2. Vérifier s'il existe
    # if not db_stock:
    #     abort(404, description=f"Le stock avec l'id {stock_id} n'existe pas.")

    # 3. Supprimer l'objet
    db.session.delete(db_stock)

    # 4. Valider la transaction
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la suppression.")