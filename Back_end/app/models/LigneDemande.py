from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer , Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement
from enum import Enum as PyEnum
if TYPE_CHECKING:
    from app.models.Demande import Demande
    from app.models.Materiel import Materiel
    

class StatutDemande(PyEnum):
    BROUILLON = "BROUILLON"
    SOUMISE = "SOUMISE"
    EN_TRAITEMENT = "EN_TRAITEMENT"
    APPROUVEE1 = "APPROUVEE1"
    APPROUVEE2 = "APPROUVEE2"
    REJETEE1 = "REJETEE1"
    REJETEE2 = "REJETEE2"
    EN_ATTENTE_STOCK = "EN_ATTENTE_STOCK"
    LIVREE = "LIVREE"


class LigneDemande(db.Model):  # ← changement
    __tablename__ = "lignes_demande"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    demande_id: Mapped[int] = mapped_column(Integer, ForeignKey("demandes.id"), index=True)
    materiel_id: Mapped[int] = mapped_column(Integer, ForeignKey("materiels.id"), index=True)
    qte_demandee: Mapped[int] = mapped_column(Integer)
    qte_accordee: Mapped[int | None] = mapped_column(Integer)
    statut_ligne: Mapped[StatutDemande] = mapped_column(Enum(StatutDemande,values_callable=lambda x: [e.value for e in x]), default=StatutDemande.BROUILLON)

    # Relations
    demande: Mapped["Demande"] = relationship("Demande", back_populates="lignes")
    materiel: Mapped["Materiel"] = relationship("Materiel", back_populates="lignes_demande")