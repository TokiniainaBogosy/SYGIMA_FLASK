from flask import abort
from app.database import db
from app.models.Stock import Stock


def delete_stock(stock_id: int):
    db_stock = Stock.query.filter(Stock.id == stock_id).first()
    if not db_stock:
        abort(404, description=f"Le stock avec l'id {stock_id} n'existe pas.")

    try:
        db.session.delete(db_stock)
        db.session.commit()
        return db_stock
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la suppression.")