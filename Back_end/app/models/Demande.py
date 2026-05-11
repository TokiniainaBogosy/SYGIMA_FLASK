from __future__ import annotations

from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Departement import Departement
    from app.models.Entreprise import Entreprise
    from app.models.LigneDemande import LigneDemande
    from app.models.MouvementStock import MouvementStock


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


class Demande(db.Model):  # ← changement
    __tablename__ = "demandes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    reference: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    demandeur_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    departement_id: Mapped[int] = mapped_column(Integer, ForeignKey("departements.id"), index=True)
    responsable_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    traite_par: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    statut: Mapped[StatutDemande] = mapped_column(Enum(StatutDemande), default=StatutDemande.BROUILLON)
    justification: Mapped[str | None] = mapped_column(String(500))
    motif_rejet: Mapped[str | None] = mapped_column(String(500))
    date_soumission: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    date_traitement: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relations
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="demandes")
    demandeur: Mapped["User"] = relationship("User", foreign_keys=[demandeur_id], back_populates="demandes_soumises")
    responsable: Mapped["User | None"] = relationship("User", foreign_keys=[responsable_id], back_populates="demandes_responsable")
    traite_par_user: Mapped["User | None"] = relationship("User", foreign_keys=[traite_par], back_populates="demandes_traitees")
    departement: Mapped["Departement"] = relationship("Departement", back_populates="demandes")
    lignes: Mapped[list["LigneDemande"]] = relationship("LigneDemande", back_populates="demande")
    mouvements: Mapped[list["MouvementStock"]] = relationship("MouvementStock", back_populates="demande")