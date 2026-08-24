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


def generate_materiel_pdf(
    categories,
    entreprise_nom
):
    """
    Génère un PDF présentant les catégories
    et les matériels de l'entreprise.

    :param categories: liste des catégories
    :param entreprise_nom: nom de l'entreprise
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
        "MaterielTitle",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    category_style = ParagraphStyle(
        "CategoryTitle",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=6,
        spaceAfter=4,
    )

    info_style = ParagraphStyle(
        "MaterielInfo",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
    )

    cell_style = ParagraphStyle(
        "MaterielCell",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
    )

    cell_center_style = ParagraphStyle(
        "MaterielCellCenter",
        parent=cell_style,
        alignment=TA_CENTER,
    )

    elements = []

    # =========================================================
    # TITRE
    # =========================================================

    elements.append(
        Paragraph(
            "Catalogue des matériels",
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
            f"<b>Date de génération :</b> "
            f"{datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            info_style
        )
    )

    elements.append(
        Spacer(1, 8 * mm)
    )

    # =========================================================
    # CATÉGORIES
    # =========================================================

    for categorie in categories:

        # -----------------------------------------------------
        # Nom de la catégorie
        # -----------------------------------------------------

        elements.append(
            Paragraph(
                f"Catégorie : {categorie.nom}",
                category_style
            )
        )

        # -----------------------------------------------------
        # Description
        # -----------------------------------------------------

        if categorie.description:
            elements.append(
                Paragraph(
                    f"<b>Description :</b> "
                    f"{categorie.description}",
                    info_style
                )
            )

            elements.append(
                Spacer(1, 3 * mm)
            )

        # -----------------------------------------------------
        # Tableau des matériels
        # -----------------------------------------------------

        headers = [
            "Référence",
            "Désignation",
            "Sous-catégorie",
            "Unité",
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

        # Matériels de cette catégorie
        materiels = categorie.materiels or []

        for materiel in materiels:

            sous_categorie = ""

            if materiel.sous_categorie:
                sous_categorie = materiel.sous_categorie.value

            row = [
                Paragraph(
                    str(materiel.reference or ""),
                    cell_style
                ),

                Paragraph(
                    str(materiel.designation or ""),
                    cell_style
                ),

                Paragraph(
                    sous_categorie,
                    cell_center_style
                ),

                Paragraph(
                    str(materiel.unite or ""),
                    cell_center_style
                ),
            ]

            table_data.append(row)

        # -----------------------------------------------------
        # Si aucun matériel
        # -----------------------------------------------------

        if not materiels:

            table_data.append(
                [
                    Paragraph(
                        "Aucun matériel dans cette catégorie.",
                        cell_style
                    ),
                    "",
                    "",
                    "",
                ]
            )

        # -----------------------------------------------------
        # Création du tableau
        # -----------------------------------------------------

        col_widths = [
            40 * mm,
            75 * mm,
            45 * mm,
            35 * mm,
        ]

        table = Table(
            table_data,
            colWidths=col_widths,
            repeatRows=1,
            hAlign="LEFT",
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

                    # Alignement
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

        elements.append(
            Spacer(1, 7 * mm)
        )

    # =========================================================
    # AUCUNE CATÉGORIE
    # =========================================================

    if not categories:

        elements.append(
            Paragraph(
                "Aucune catégorie de matériel n'est enregistrée.",
                info_style
            )
        )

    # =========================================================
    # GÉNÉRATION
    # =========================================================

    doc.build(elements)

    buffer.seek(0)

    return buffer