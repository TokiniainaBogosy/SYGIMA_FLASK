from __future__ import annotations
from typing import Optional
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING
from app.database import db

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models.User import User
    from app.models.Entreprise import Entreprise
    from app.models.Departement import Departement


class TypeNotification(PyEnum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    SUCCESS = "SUCCESS"  # Ajouté


class Notification(db.Model):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    
    # Département et émetteur
    departement_id: Mapped[Optional[int]] = mapped_column(
        Integer, 
        ForeignKey("departements.id"), 
        nullable=True,
        index=True
    )
    
    sender_id: Mapped[Optional[int]] = mapped_column(
        Integer, 
        ForeignKey("users.id"), 
        nullable=True
    )
    
    message: Mapped[str] = mapped_column(String(500))
    type: Mapped[TypeNotification] = mapped_column(Enum(TypeNotification), default=TypeNotification.INFO)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relations
    entreprise: Mapped["Entreprise"] = relationship(
        "Entreprise",
        back_populates="notifications"
    )

    # Destinataire
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="notifications"
    )

    # Expéditeur
    sender: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="sent_notifications"
    )

    # Département
    departement: Mapped[Optional["Departement"]] = relationship(
        "Departement",
        back_populates="notifications"
    )

    def to_dict(self):
        """Convertir en dictionnaire pour l'API"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'senderId': self.sender_id,
            'entrepriseId': self.entreprise_id,
            'departementId': self.departement_id,
            'message': self.message,
            'type': self.type.value.lower(),
            'read': self.is_read,
            'timestamp': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<Notification {self.id}: {self.message[:30]}>'