from app.models.ResponsableDepartement import ResponsableDepartement
from app.models.User import User
from app.models.UserEntreprise import UserEntreprise
from app.database import db

def update_responsable(data, current_user):
    if data["old_user_name"] != None:
        old_responsable = ResponsableDepartement.query.filter_by(
            user_id= User.query.filter_by(nom=data["old_user_name"]).first().id,
            departement_id=data["departement_id"]
        ).first()
        if not old_responsable:
            raise ValueError("Old responsable not found")
    
        old_responsable_user = User.query.filter_by(nom=data["old_user_name"]).first() # pour changer le role dans la table User
        if not old_responsable_user:
            raise ValueError("Old responsable user not found")
        
        old_responsable_user.role = "EMPLOYE"
        db.session.add(old_responsable_user)

        old_user_entreprise = UserEntreprise.query.filter_by( # pour changer le role dans la table UserEntreprise
            user_id=User.query.filter_by(nom=data["old_user_name"]).first().id,
            entreprise_id=current_user.entreprise_id
        ).first()
        if not old_user_entreprise:
            raise ValueError("Old responsable user entreprise not found")
        old_user_entreprise.role_entreprise = "EMPLOYE"
        db.session.add(old_user_entreprise)

        db.session.delete(old_responsable)

    new_responsable = ResponsableDepartement(
        user_id=data["user_id"],
        departement_id=data["departement_id"]
        # entreprise_id=current_user.entreprise_id
    )

    new_responsable_user = User.query.get(data["user_id"])
    if not new_responsable_user:
        raise ValueError("New responsable user not found")
    new_responsable_user.role = "RESPONSABLE"
    db.session.add(new_responsable_user)

    new_user_entreprise = UserEntreprise.query.filter_by(
        user_id=data["user_id"],
        entreprise_id=current_user.entreprise_id
    ).first()
    if not new_user_entreprise:
        raise ValueError("New responsable user entreprise not found")
    new_user_entreprise.role_entreprise = "RESPONSABLE"
    db.session.add(new_user_entreprise)

    db.session.add(new_responsable)
    db.session.commit()
    return new_responsable