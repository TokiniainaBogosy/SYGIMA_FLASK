from flask import abort
from app.database import db
from app.models.Stock import Stock
from app.models.Materiel import Materiel


def update_stock(stock_id: int, data: dict):

    # 1. Chercher l'existant
    db_obj = Stock.query.filter(Stock.id == stock_id).first()

    if not db_obj:
        abort(404, description="Stock non trouvé")

    # 2. Appliquer les changements dynamiquement (on ignore ce qui est None)
    for field, value in data.items():
        if value is None:
            continue

        if field == "designation":
            # Si on veut mettre à jour la désignation, il faut aussi mettre à jour le matériel
            materiel = Materiel.query.filter(Materiel.id == db_obj.materiel_id).first()
            if not materiel:
                abort(404, description="Matériel non trouvé")
            field = "materiel_id"
            value = materiel.id

        setattr(db_obj, field, value)

    # 3. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour du stock.")