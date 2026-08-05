from __future__ import annotations 
from enum import Enum
from sqlalchemy import Enum as SQLEnum


from typing import TYPE_CHECKING 
from sqlalchemy import Boolean, ForeignKey, Integer, String 
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from app.database import db # ← changement 
if TYPE_CHECKING: 
    from app.models.Entreprise import Entreprise 
    from app.models.CategoriesMateriel import CategoriesMateriel 
    from app.models.Departement import Departement 
    from app.models.Stock import Stock 
    from app.models.MouvementStock import MouvementStock 
    from app.models.LigneDemande import LigneDemande 
    from app.models.InventaireMaterielEmploye import InventaireEmploye


class SousCategorieMateriel(Enum):
    CONSOMMABLE = "consommable"
    EQUIPEMENT = "equipement"

class Materiel(db.Model):
    __tablename__ = "materiels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entreprise_id: Mapped[int] = mapped_column(Integer, ForeignKey("entreprises.id"), index=True)
    categorie_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories_materiel.id"), index=True)
    departement_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("departements.id"), index=True)
    reference: Mapped[str] = mapped_column(String(50), index=True)
    designation: Mapped[str] = mapped_column(String(255))
    unite: Mapped[str] = mapped_column(String(50))

    # Nouvelle colonne
    sous_categorie: Mapped[SousCategorieMateriel] = mapped_column(
        SQLEnum(SousCategorieMateriel),
        nullable=False,
        default=SousCategorieMateriel.EQUIPEMENT,
    )

    is_global: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relations
    entreprise: Mapped["Entreprise"] = relationship("Entreprise", back_populates="materiels") 
    categorie: Mapped["CategoriesMateriel"] = relationship("CategoriesMateriel", back_populates="materiels") 
    departement: Mapped["Departement | None"] = relationship("Departement", back_populates="materiels") 
    stocks: Mapped[list["Stock"]] = relationship("Stock", back_populates="materiel") 
    mouvements: Mapped[list["MouvementStock"]] = relationship("MouvementStock", back_populates="materiel") 
    lignes_demande: Mapped[list["LigneDemande"]] = relationship("LigneDemande", back_populates="materiel") 
    inventaire: Mapped[list["InventaireEmploye"]] = relationship("InventaireEmploye", back_populates="materiel") 