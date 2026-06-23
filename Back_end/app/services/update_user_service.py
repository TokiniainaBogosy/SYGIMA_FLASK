from flask import abort
from marshmallow import ValidationError
from app.database import db
from app.models.User import User
from app.models.Departement import Departement


def update_user(user_id: int, data: dict):

    # 1. Chercher l'existant
    db_obj = User.query.filter(User.id == user_id).first()

    if not db_obj:
        abort(404, description="User non trouvée")

    # 2. Appliquer les changements dynamiquement (on ignore ce qui est None)
    # 1. On intercepte 'departement_id' s'il est présent dans les données reçues
    if "departement_id" in data and data["departement_id"] is not None:
        nom_du_departement = data["departement_id"]
        
        # 2. On cherche le département en BDD par son nom
        # (Adaptez 'Departement' selon le nom de votre modèle SQLAlchemy)
        dept_obj = Departement.query.filter_by(nom=nom_du_departement).first()
        
        if dept_obj:
            # On remplace le string par le véritable ID numérique
            data["departement_id"] = dept_obj.id
        else:
            # Optionnel : gérer le cas où le département n'existe pas
            raise ValidationError(f"Le département '{nom_du_departement}' n'existe pas.")
        
    for field, value in data.items():
        if value is not None:
            setattr(db_obj, field, value)

    # 3. Sauvegarder
    try:
        db.session.commit()
        db.session.refresh(db_obj)
        return db_obj
    except Exception as e:
        db.session.rollback()
        print(f"Erreur : {e}")
        abort(500, description="Erreur lors de la mise à jour.")

    