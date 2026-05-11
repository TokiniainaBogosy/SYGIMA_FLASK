from __future__ import annotations

from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement

if TYPE_CHECKING:
    from app.models.Materiel import Materiel
    from app.models.Departement import Departement
    from app.models.Demande import Demande
    from app.models.User import User
    from app.models.Entreprise import Entreprise


class TypeMouvement(PyEnum):
    ENTREE = "ENTREE"
    SORTIE = "SORTIE"


class MouvementStock(db.Model):  # ← changement
    __tablename__ = "mouvements_stock"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    materiel_id: Mapped[int] = mapped_column(Integer, ForeignKey("materiels.id"), index=True)
    departement_id: Mapped[int] = mapped_column(Integer, ForeignKey("departements.id"), index=True)
    demande_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("demandes.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    type_mouvement: Mapped[TypeMouvement] = mapped_column(Enum(TypeMouvement), default=TypeMouvement.SORTIE)
    quantite: Mapped[int] = mapped_column(Integer)
    signature_url: Mapped[str | None] = mapped_column(String(500))
    date_mouvement: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="mouvements_stock")
    materiel: Mapped["Materiel"] = relationship("Materiel", back_populates="mouvements")
    departement: Mapped["Departement"] = relationship("Departement", back_populates="mouvements")
    demande: Mapped["Demande | None"] = relationship("Demande", back_populates="mouvements")
    user: Mapped["User"] = relationship("User", back_populates="mouvements")