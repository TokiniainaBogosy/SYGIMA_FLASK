from datetime import datetime
from app.database import db 

class HistoriqueAction(db.Model):
    __tablename__ = 'historique_actions'

    id = db.Column(db.Integer, primary_key=True)
    
    # Isolation Multi-tenant
    entreprise_id = db.Column(db.Integer, db.ForeignKey('entreprises.id'), nullable=False)
    
    # Auteur de l'action
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nullable si action système
    
    # Métadonnées de l'action
    action = db.Column(db.String(50), nullable=False)          # ex: 'CREATION', 'MODIFICATION', 'SUPPRESSION'
    table_cible = db.Column(db.String(100), nullable=False)    # ex: 'materiels', 'demandes'
    id_cible = db.Column(db.Integer, nullable=False)           # ID de la ligne concernée
    
    # Contenu évolutif
    details = db.Column(db.JSON, nullable=True)                # ex: {"nom": "Nouveau nom"}
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relations (Optionnel mais recommandé pour les jointures inverses)
    entreprise = db.relationship('Entreprise', backref='historiques')
    user = db.relationship('User', backref='actions_effectuees')