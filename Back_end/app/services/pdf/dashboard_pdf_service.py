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


def generate_dashboard_pdf(
    stats,
    entreprise_nom,
    departement_nom
):
    """
    Génère le PDF du tableau de bord
    pour un département donné.

    :param stats: dictionnaire retourné par get_dashboard_stats()
    :param entreprise_nom: nom de l'entreprise
    :param departement_nom: nom du département
    :return: BytesIO contenant le PDF
    """

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    # ---------------------------------------------------------
    # STYLES
    # ---------------------------------------------------------

    title_style = ParagraphStyle(
        "DashboardTitle",
        parent=styles["Title"],
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        spaceAfter=10,
    )

    info_style = ParagraphStyle(
        "DashboardInfo",
        parent=styles["Normal"],
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
    )

    card_title_style = ParagraphStyle(
        "CardTitle",
        parent=styles["Normal"],
        fontSize=9,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#6B7280"),
    )

    card_value_style = ParagraphStyle(
        "CardValue",
        parent=styles["Normal"],
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#111827"),
    )

    section_style = ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        spaceAfter=6,
    )

    cell_style = ParagraphStyle(
        "Cell",
        parent=styles["Normal"],
        fontSize=8,
        leading=10,
    )

    cell_center_style = ParagraphStyle(
        "CellCenter",
        parent=cell_style,
        alignment=TA_CENTER,
    )

    elements = []

    # ---------------------------------------------------------
    # TITRE
    # ---------------------------------------------------------

    elements.append(
        Paragraph(
            "Tableau de bord",
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

    # ---------------------------------------------------------
    # STATISTIQUES
    # ---------------------------------------------------------

    total_materiels = stats.get("total_materiels", 0)
    total_demandes = stats.get("total_demandes", 0)
    demandes_en_cours = stats.get(
        "total_demandes_en_cours",
        0
    )
    demandes_approuvees = stats.get(
        "demandes_approuvees",
        0
    )
    demandes_rejetees = stats.get(
        "total_demandes_rejetées",
        0
    )
    alertes_stock = stats.get(
        "alertes_stock",
        0
    )

    cards = [
        ("Matériels en stock", total_materiels),
        ("Total des demandes", total_demandes),
        ("Demandes en cours", demandes_en_cours),
        ("Demandes approuvées", demandes_approuvees),
        ("Demandes rejetées", demandes_rejetees),
        ("Alertes stock", alertes_stock),
    ]

    card_data = []

    # Première ligne
    row1 = []

    for title, value in cards[:3]:

        content = [
            Paragraph(
                title,
                card_title_style
            ),
            Spacer(1, 3 * mm),
            Paragraph(
                str(value),
                card_value_style
            ),
        ]

        cell = Table(
            [[content]],
            colWidths=[80 * mm],
            rowHeights=[25 * mm],
        )

        cell.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#F9FAFB"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.8,
                        colors.HexColor("#E5E7EB"),
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                ]
            )
        )

        row1.append(cell)

    card_data.append(row1)

    # Deuxième ligne
    row2 = []

    for title, value in cards[3:6]:

        content = [
            Paragraph(
                title,
                card_title_style
            ),
            Spacer(1, 3 * mm),
            Paragraph(
                str(value),
                card_value_style
            ),
        ]

        cell = Table(
            [[content]],
            colWidths=[80 * mm],
            rowHeights=[25 * mm],
        )

        cell.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#F9FAFB"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.8,
                        colors.HexColor("#E5E7EB"),
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                ]
            )
        )

        row2.append(cell)

    card_data.append(row2)

    cards_table = Table(
        card_data,
        colWidths=[
            85 * mm,
            85 * mm,
            85 * mm,
        ],
        hAlign="CENTER",
    )

    cards_table.setStyle(
        TableStyle(
            [
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
            ]
        )
    )

    elements.append(cards_table)

    elements.append(
        Spacer(1, 10 * mm)
    )

    # ---------------------------------------------------------
    # ACTIVITÉ HEBDOMADAIRE
    # ---------------------------------------------------------

    elements.append(
        Paragraph(
            "Activité hebdomadaire",
            section_style
        )
    )

    activite = stats.get(
        "activite_hebdo",
        []
    )

    activity_data = [
        [
            Paragraph("<b>Jour</b>", cell_center_style),
            Paragraph("<b>Nombre de demandes</b>", cell_center_style),
        ]
    ]

    for jour in activite:

        activity_data.append(
            [
                Paragraph(
                    str(jour.get("label", "")),
                    cell_center_style
                ),
                Paragraph(
                    str(jour.get("value", 0)),
                    cell_center_style
                ),
            ]
        )

    activity_table = Table(
        activity_data,
        colWidths=[
            50 * mm,
            60 * mm,
        ],
        hAlign="LEFT",
    )

    activity_table.setStyle(
        TableStyle(
            [
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
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#D1D5DB"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#F9FAFB"),
                    ],
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
            ]
        )
    )

    elements.append(activity_table)

    # ---------------------------------------------------------
    # GÉNÉRATION
    # ---------------------------------------------------------

    doc.build(elements)

    buffer.seek(0)

    return buffer