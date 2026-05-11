from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement

if TYPE_CHECKING:
    from app.models.Demande import Demande
    from app.models.Materiel import Materiel


class LigneDemande(db.Model):  # ← changement
    __tablename__ = "lignes_demande"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    demande_id: Mapped[int] = mapped_column(Integer, ForeignKey("demandes.id"), index=True)
    materiel_id: Mapped[int] = mapped_column(Integer, ForeignKey("materiels.id"), index=True)
    qte_demandee: Mapped[int] = mapped_column(Integer)
    qte_accordee: Mapped[int | None] = mapped_column(Integer)

    # Relations
    demande: Mapped["Demande"] = relationship("Demande", back_populates="lignes")
    materiel: Mapped["Materiel"] = relationship("Materiel", back_populates="lignes_demande")