from flask import abort
from app.database import db
from app.models.InventaireMaterielEmploye import InventaireEmploye


def update_inventaire(inventaire_id: int, data: dict):

    # 1. Chercher l'inventaire
    db_obj = InventaireEmploye.query.filter(InventaireEmploye.id == inventaire_id).first()
    db_materiel = db_obj.materiel  # Accéder à l'objet Materiel associé
    if not db_obj:
        abort(404, description="Inventaire non trouvé")

    # 2. Récupérer la nouvelle quantité
    nouvelle_quantite = data.get("quantite")

    if nouvelle_quantite is None:
        abort(400, description="Le champ 'quantite' est requis.")

    if nouvelle_quantite < 0:
        abort(400, description="La quantité ne peut pas être négative.")

    if nouvelle_quantite > db_obj.quantite:
        abort(400, description=f"Quantité insuffisante. Maximum : {db_obj.quantite}")

    db_obj.quantite = nouvelle_quantite

    # 3. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj,db_materiel  # Retourner l'objet mis à jour pour l'historique
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour de l'inventaire.")