from flask import abort
from app.database import db
from app.models.Stock import Stock
from app.models.Materiel import Materiel
from app.models.User import User


def create_stock(data: dict, current_user: User,current_user_entreprise):

    materiel = Materiel.query.filter(Materiel.designation == data.get("materiel")).first()
    # if not materiel:
    #     abort(404, description="Matériel introuvable")

    quantite_ajoutee = data.get("quantite")

    # Vérifier si un stock existe déjà pour ce matériel + département
    stock_existing = Stock.query.filter(
        Stock.materiel_id == materiel.id,
        Stock.departement_id == current_user.departement_id
    ).first()

    if stock_existing:
        stock_existing.quantite_actuelle += quantite_ajoutee
        try:
            db.session.commit()
            db.session.refresh(stock_existing)
            return stock_existing
        except Exception as e:
            db.session.rollback()
            print(f"ERREUR REELLE : {str(e)}")
            abort(500, description=str(e))

    db_stock = Stock(
        quantite_actuelle=quantite_ajoutee,
        materiel_id=materiel.id,
        departement_id=current_user.departement_id,
        entreprise_id=current_user_entreprise.entreprise_id
    )

    try:
        db.session.add(db_stock)
        db.session.commit()
        db.session.refresh(db_stock)
        return db_stock
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur interne lors de l'insertion en base de données")