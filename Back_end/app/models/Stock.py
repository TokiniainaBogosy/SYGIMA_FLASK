from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement

if TYPE_CHECKING:
    from app.models.Materiel import Materiel
    from app.models.Departement import Departement
    from app.models.Entreprise import Entreprise


class Stock(db.Model):  # ← changement
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    materiel_id: Mapped[int] = mapped_column(Integer, ForeignKey("materiels.id"), index=True)
    departement_id: Mapped[int] = mapped_column(Integer, ForeignKey("departements.id"), index=True)
    quantite_actuelle: Mapped[int] = mapped_column(Integer, default=0)
    seuil_alerte: Mapped[int] = mapped_column(Integer, default=5)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relations
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="stocks")
    materiel: Mapped["Materiel"] = relationship("Materiel", back_populates="stocks")
    departement: Mapped["Departement"] = relationship("Departement", back_populates="stocks")

    # Un matériel ne peut avoir qu'un seul stock par département
    __table_args__ = (
        UniqueConstraint("materiel_id", "departement_id", name="_materiel_departement_uc"),
    )