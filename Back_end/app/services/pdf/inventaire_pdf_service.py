from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def generate_inventaire_pdf(
    inventaires,
    entreprise_nom,
    departement_nom
):
    """
    Génère le PDF de l'inventaire des matériels utilisés.

    :param inventaires: liste des objets InventaireEmploye
    :param entreprise_nom: nom de l'entreprise
    :param departement_nom: nom du département
    :return: BytesIO contenant le PDF
    """

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "InventaireTitle",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    info_style = ParagraphStyle(
        "InventaireInfo",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
    )

    cell_style = ParagraphStyle(
        "InventaireCell",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
    )

    cell_center_style = ParagraphStyle(
        "InventaireCellCenter",
        parent=cell_style,
        alignment=TA_CENTER,
    )

    elements = []

    # =========================================================
    # TITRE
    # =========================================================

    elements.append(
        Paragraph(
            "Inventaire des matériels utilisés",
            title_style
        )
    )

    elements.append(
        Paragraph(
            f"<b>Entreprise :</b> {entreprise_nom}",
            info_style
        )
    )

    elements.append(
        Paragraph(
            f"<b>Département :</b> {departement_nom}",
            info_style
        )
    )

    elements.append(
        Paragraph(
            f"<b>Date de génération :</b> "
            f"{datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            info_style
        )
    )

    elements.append(
        Spacer(1, 8 * mm)
    )

    # =========================================================
    # TABLEAU
    # =========================================================

    headers = [
        "Employé",
        "Matériel",
        "Référence",
        "Catégorie",
        "Sous-catégorie",
        "Quantité",
        "Département",
        "Dernière mise à jour",
    ]

    table_data = [
        [
            Paragraph(
                f"<b>{header}</b>",
                cell_center_style
            )
            for header in headers
        ]
    ]

    for inventaire in inventaires:

        user = inventaire.user
        materiel = inventaire.materiel
        categorie = materiel.categorie if materiel else None
        departement = inventaire.departement

        # -----------------------------------------------------
        # Employé
        # -----------------------------------------------------

        if user:
            employe = f"{user.prenom} {user.nom}"
        else:
            employe = ""

        # -----------------------------------------------------
        # Sous-catégorie
        # -----------------------------------------------------

        sous_categorie = ""

        if materiel and materiel.sous_categorie:
            sous_categorie = materiel.sous_categorie.value

        # -----------------------------------------------------
        # Date
        # -----------------------------------------------------

        date_update = ""

        if inventaire.updated_at:
            date_update = inventaire.updated_at.strftime(
                "%d/%m/%Y %H:%M"
            )

        # -----------------------------------------------------
        # Ligne
        # -----------------------------------------------------

        row = [
            Paragraph(
                employe,
                cell_style
            ),

            Paragraph(
                str(
                    materiel.designation
                    if materiel
                    else ""
                ),
                cell_style
            ),

            Paragraph(
                str(
                    materiel.reference
                    if materiel
                    else ""
                ),
                cell_style
            ),

            Paragraph(
                str(
                    categorie.nom
                    if categorie
                    else ""
                ),
                cell_style
            ),

            Paragraph(
                str(sous_categorie),
                cell_style
            ),

            Paragraph(
                str(inventaire.quantite or 0),
                cell_center_style
            ),

            Paragraph(
                str(
                    departement.nom
                    if departement
                    else ""
                ),
                cell_style
            ),

            Paragraph(
                date_update,
                cell_center_style
            ),
        ]

        table_data.append(row)

    # =========================================================
    # TABLE
    # =========================================================

    col_widths = [
        42 * mm,  # Employé
        45 * mm,  # Matériel
        28 * mm,  # Référence
        32 * mm,  # Catégorie
        32 * mm,  # Sous-catégorie
        22 * mm,  # Quantité
        38 * mm,  # Département
        38 * mm,  # Date
    ]

    table = Table(
        table_data,
        colWidths=col_widths,
        repeatRows=1,
        hAlign="CENTER",
    )

    table.setStyle(
        TableStyle(
            [
                # En-tête
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2563EB"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),

                # Alignement vertical
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),

                # Bordures
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#D1D5DB"),
                ),

                # Padding
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),

                # Alternance des lignes
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#F9FAFB"),
                    ],
                ),
            ]
        )
    )

    elements.append(table)

    # =========================================================
    # AUCUN INVENTAIRE
    # =========================================================

    if not inventaires:

        elements.append(
            Spacer(1, 5 * mm)
        )

        elements.append(
            Paragraph(
                "Aucun matériel utilisé n'est enregistré "
                "pour ce département.",
                info_style
            )
        )

    # =========================================================
    # GENERATION
    # =========================================================

    doc.build(elements)

    buffer.seek(0)

    return buffer