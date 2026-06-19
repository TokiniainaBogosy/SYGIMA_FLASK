from flask import Flask
from app.core.config import Config
from app.database import db
from app.extensions import migrate, jwt
from flask_socketio import SocketIO
from flask_cors import CORS

socketio = SocketIO() 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, 
         resources={r"/*": {"origins": "*"}},  # Autoriser toutes les origines en dev
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    
    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(
        app,
        cors_allowed_origins="http://localhost:5173",
        async_mode='eventlet',
        logger=True,
        engineio_logger=False
    )
    

    from app.routes.Auth import auth_bp
    from app.routes.Demande import departement_bp
    from app.routes.Demande1 import demande_bp
    from app.routes.Entreprise import entreprise_bp
    from app.routes.Materiel import materiel_bp
    from app.routes.User import user_bp
    from app.routes.Stats import stats_bp
    from app.routes.Current_user import current_user_bp
    from app.routes.Dashboard import dashboard_bp
    from app.routes.Responsable import responsable_bp
    from app.routes.notifications import notifications_bp

    app.register_blueprint(current_user_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(departement_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(demande_bp)
    app.register_blueprint(entreprise_bp)
    app.register_blueprint(materiel_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(responsable_bp)

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
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    from app.socket_events import register_socket_events
    register_socket_events(socketio)

    return app