from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db

if TYPE_CHECKING:
    from app.models.Entreprise import Entreprise
    from app.models.Materiel import Materiel
    from app.models.Departement import Departement


class CategoriesMateriel(db.Model):
    __tablename__ = "categories_materiel"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    nom: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(500))
    is_global: Mapped[bool] = mapped_column(Boolean, default=False)
    departement_id: Mapped[int] = mapped_column(Integer,ForeignKey("departements.id"),index=True)

    # Relations
    entreprise: Mapped["Entreprise | None"] = relationship("Entreprise", back_populates="categories_materiel")
    materiels: Mapped[list["Materiel"]] = relationship("Materiel", back_populates="categorie")
    departement: Mapped["Departement"] = relationship("Departement",back_populates="categories_materiel")

    # Contrainte : nom unique par entreprise
    __table_args__ = (
        UniqueConstraint("nom", "entreprise_id","departement_id", name="_nom_entreprise_departement_uc"),
    )