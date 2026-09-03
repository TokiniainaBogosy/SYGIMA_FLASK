from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Entreprise import Entreprise


class UserEntreprise(db.Model):
    __tablename__ = "user_entreprises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    role_entreprise: Mapped[str] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relations
    user: Mapped["User"] = relationship("User", back_populates="user_entreprises")
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="user_entreprises")