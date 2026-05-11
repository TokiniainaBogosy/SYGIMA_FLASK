from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db  # ← changement

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Departement import Departement


class ResponsableDepartement(db.Model):  # ← changement
    __tablename__ = "responsable_departements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    departement_id: Mapped[int] = mapped_column(Integer, ForeignKey("departements.id"), index=True)

    # Relations
    user: Mapped["User"] = relationship("User", back_populates="responsabilites")
    departement: Mapped["Departement"] = relationship("Departement", back_populates="responsables")

    # Un utilisateur ne peut être responsable qu'une seule fois par département
    __table_args__ = (
        UniqueConstraint("user_id", "departement_id", name="_user_departement_uc"),
    )