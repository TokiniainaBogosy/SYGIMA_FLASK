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


def generate_stock_pdf(stocks, entreprise_nom, departement_nom):
    """
    Génère un PDF contenant l'état du stock.

    :param stocks: liste des objets Stock
    :param entreprise_nom: nom de l'entreprise
    :return: BytesIO contenant le PDF
    """

    buffer = BytesIO()

    # Paysage pour avoir suffisamment de place pour les colonnes
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
        "StockTitle",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    info_style = ParagraphStyle(
        "StockInfo",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
    )

    cell_style = ParagraphStyle(
        "StockCell",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
    )

    cell_center_style = ParagraphStyle(
        "StockCellCenter",
        parent=cell_style,
        alignment=TA_CENTER,
    )

    elements = []

    # ---------------------------------------------------------
    # TITRE
    # ---------------------------------------------------------

    elements.append(
        Paragraph(
            "État du stock",
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

    elements.append(Spacer(1, 8 * mm))

    # ---------------------------------------------------------
    # TABLEAU
    # ---------------------------------------------------------

    headers = [
        "Référence",
        "Désignation",
        "Catégorie",
        "Sous-catégorie",
        "Quantité",
        "Seuil d'alerte",
        "État",
    ]

    table_data = [
        [
            Paragraph(f"<b>{header}</b>", cell_center_style)
            for header in headers
        ]
    ]

    for stock in stocks:

        materiel = stock.materiel
        categorie = materiel.categorie if materiel else None
        departement = stock.departement

        # -----------------------------------------------------
        # Sous-catégorie
        # -----------------------------------------------------

        sous_categorie = ""

        if materiel and materiel.sous_categorie:
            sous_categorie = materiel.sous_categorie.value

        # -----------------------------------------------------
        # État du stock
        # -----------------------------------------------------

        quantite = stock.quantite_actuelle or 0
        seuil = stock.seuil_alerte or 0

        if quantite <= 0:
            etat = "RUPTURE"
        elif quantite <= seuil:
            etat = "ALERTE"
        else:
            etat = "NORMAL"

        # -----------------------------------------------------
        # Ligne
        # -----------------------------------------------------

        row = [
            Paragraph(
                str(materiel.reference if materiel else ""),
                cell_style
            ),

            Paragraph(
                str(materiel.designation if materiel else ""),
                cell_style
            ),

            Paragraph(
                str(categorie.nom if categorie else ""),
                cell_style
            ),

            Paragraph(
                str(sous_categorie),
                cell_style
            ),
            Paragraph(
                str(quantite),
                cell_center_style
            ),

            Paragraph(
                str(seuil),
                cell_center_style
            ),

            Paragraph(
                etat,
                cell_center_style
            ),
        ]

        table_data.append(row)

    # ---------------------------------------------------------
    # TABLE
    # ---------------------------------------------------------

    col_widths = [
        28 * mm,   # référence
        48 * mm,   # désignation
        32 * mm,   # catégorie
        32 * mm,   # sous-catégorie
        25 * mm,   # quantité
        28 * mm,   # seuil
        25 * mm,   # état
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

    # ---------------------------------------------------------
    # AUCUN STOCK
    # ---------------------------------------------------------

    if not stocks:
        elements.append(
            Spacer(1, 5 * mm)
        )

        elements.append(
            Paragraph(
                "Aucun matériel en stock.",
                info_style
            )
        )

    # ---------------------------------------------------------
    # GENERATION
    # ---------------------------------------------------------

    doc.build(elements)

    buffer.seek(0)

    return buffer