from __future__ import annotations

from datetime import datetime
from enum import Enum as PyEnum
from typing import List ,Optional
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db

if TYPE_CHECKING:
    from app.models.Departement import Departement
    from app.models.UserEntreprise import UserEntreprise
    from app.models.Demande import Demande
    from app.models.MouvementStock import MouvementStock
    from app.models.Notification import Notification
    from app.models.ResponsableDepartement import ResponsableDepartement
    from app.models.InventaireMaterielEmploye import InventaireEmploye


class RoleUser(PyEnum):
    EMPLOYE = "EMPLOYE"
    RESPONSABLE = "RESPONSABLE"
    MAGASINIER = "MAGASINIER"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nom: Mapped[str] = mapped_column(String(255))
    prenom: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[RoleUser] = mapped_column(
        SAEnum(RoleUser, values_callable=lambda obj: [e.value for e in obj]),  # ← fix
        default=RoleUser.EMPLOYE
    )
    departement_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departements.id"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    departement: Mapped["Departement | None"] = relationship("Departement", back_populates="users")
    user_entreprises: Mapped[list["UserEntreprise"]] = relationship("UserEntreprise", back_populates="user")
    demandes_soumises: Mapped[list["Demande"]] = relationship("Demande", foreign_keys="Demande.demandeur_id", back_populates="demandeur")
    demandes_responsable: Mapped[list["Demande"]] = relationship("Demande", foreign_keys="Demande.responsable_id", back_populates="responsable")
    demandes_traitees: Mapped[list["Demande"]] = relationship("Demande", foreign_keys="Demande.traite_par", back_populates="traite_par_user")
    mouvements: Mapped[list["MouvementStock"]] = relationship("MouvementStock", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship(
    "Notification",
    foreign_keys="Notification.user_id",   # ✅ IMPORTANT
    back_populates="user"
)
    sent_notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        foreign_keys="Notification.sender_id",
        back_populates="sender"
    )
    responsabilites: Mapped[list["ResponsableDepartement"]] = relationship("ResponsableDepartement", back_populates="user")
    inventaire: Mapped[list["InventaireEmploye"]] = relationship("InventaireEmploye", back_populates="user")