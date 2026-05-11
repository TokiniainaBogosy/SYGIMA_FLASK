from flask import Flask
from app.core.config import Config
from app.database import db
from app.extensions import migrate, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.routes.Auth import auth_bp
    from app.routes.Demande import departement_bp
    from app.routes.Demande1 import demande_bp
    from app.routes.Entreprise import entreprise_bp
    from app.routes.Materiel import materiel_bp
    from app.routes.User import user_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(departement_bp)
    app.register_blueprint(demande_bp)
    app.register_blueprint(entreprise_bp)
    app.register_blueprint(materiel_bp)
    app.register_blueprint(user_bp)

    with app.app_context():
        from app.models import (
            Entreprise,
            User,
            Departement,
            CategoriesMateriel,
            UserEntreprise,
            ResponsableDepartement,
            Materiel,
            Stock,
            Demande,
            LigneDemande,
            MouvementStock,
            Notification,
        )

    return app