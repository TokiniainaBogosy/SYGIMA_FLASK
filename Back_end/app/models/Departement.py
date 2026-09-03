from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db

if TYPE_CHECKING:
    from app.models.Entreprise import Entreprise
    from app.models.Demande import Demande
    from app.models.Stock import Stock
    from app.models.ResponsableDepartement import ResponsableDepartement
    from app.models.Notification import Notification
    from app.models.InventaireMaterielEmploye import InventaireEmploye  
    from app.models.CategoriesMateriel import CategoriesMateriel

class Departement(db.Model):
    __tablename__ = "departements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    code: Mapped[str] = mapped_column(String(50), index=True)
    nom: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    users = relationship("User", back_populates="departement")
    materiels = relationship("Materiel", back_populates="departement")
    mouvements = relationship("MouvementStock", back_populates="departement")
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="departements")
    demandes: Mapped[list["Demande"]] = relationship("Demande", back_populates="departement")
    stocks: Mapped[list["Stock"]] = relationship("Stock", back_populates="departement")
    responsables: Mapped[list["ResponsableDepartement"]] = relationship("ResponsableDepartement", back_populates="departement")
    categories_materiel: Mapped[list["CategoriesMateriel"]] = relationship("CategoriesMateriel",back_populates="departement")
    notifications: Mapped[list["Notification"]] = relationship(
    "Notification",
    back_populates="departement"
)
    inventaire: Mapped[list["InventaireEmploye"]] = relationship("InventaireEmploye", back_populates="departement")
    # code unique par entreprise (pas globalement)
    __table_args__ = (
        UniqueConstraint("code", "entreprise_id", name="_code_entreprise_uc"),
    )