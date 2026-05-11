from __future__ import annotations

from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Entreprise import Entreprise


class TypeNotification(PyEnum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    message: Mapped[str] = mapped_column(String(500))
    type: Mapped[TypeNotification] = mapped_column(Enum(TypeNotification), default=TypeNotification.INFO)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="notifications")
    user: Mapped["User"] = relationship("User", back_populates="notifications")
