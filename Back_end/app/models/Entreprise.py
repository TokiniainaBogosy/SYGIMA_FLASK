from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import db  # ← changement


class Entreprise(db.Model):  # ← changement
    __tablename__ = "entreprises"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, unique=True, index=True)
    logo_url = Column(String(500), nullable=True)
    adresse = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relations
    departements = relationship("Departement", back_populates="entreprise", lazy="select")
    user_entreprises = relationship("UserEntreprise", back_populates="entreprise", lazy="select")
    categories_materiel = relationship("CategoriesMateriel", back_populates="entreprise", lazy="select")
    materiels = relationship("Materiel", back_populates="entreprise", lazy="select")
    stocks = relationship("Stock", back_populates="entreprise", lazy="select")
    demandes = relationship("Demande", back_populates="entreprise", lazy="select")
    mouvements_stock = relationship("MouvementStock", back_populates="entreprise", lazy="select")
    notifications = relationship("Notification", back_populates="entreprise", lazy="select")

    def __repr__(self) -> str:
        return f"<Entreprise id={self.id} code={self.code!r} nom={self.nom!r}>"