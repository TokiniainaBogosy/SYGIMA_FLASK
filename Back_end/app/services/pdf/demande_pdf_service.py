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
    PageBreak,
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics


def format_date(date_value):
    """
    Transforme une date Python en texte lisible.
    """
    if not date_value:
        return "-"

    if isinstance(date_value, datetime):
        return date_value.strftime("%d/%m/%Y %H:%M")

    return str(date_value)


def format_value(value):
    """
    Évite d'avoir None dans le PDF.
    """
    if value is None or value == "":
        return "-"

    return str(value)


def get_status_color(status):
    """
    Retourne une couleur selon le statut de la demande.
    """

    status = format_value(status).upper()

    if status in ["APPROUVEE1", "APPROUVEE2", "LIVREE"]:
        return colors.HexColor("#16a34a")

    if status in ["REJETEE1", "REJETEE2"]:
        return colors.HexColor("#dc2626")

    if status in ["EN_TRAITEMENT", "EN_ATTENTE_STOCK"]:
        return colors.HexColor("#f59e0b")

    if status == "SOUMISE":
        return colors.HexColor("#2563eb")

    return colors.HexColor("#6b7280")


def build_styles():
    """
    Création des styles utilisés dans le PDF.
    """

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#6b7280"),
        alignment=TA_CENTER,
        spaceAfter=15,
    )

    section_style = ParagraphStyle(
        "SectionTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#111827"),
        spaceBefore=8,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "NormalCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7,
        leading=9,
    )

    return {
        "title": title_style,
        "subtitle": subtitle_style,
        "section": section_style,
        "normal": normal_style,
        "small": small_style,
    }


def footer(canvas, doc):
    """
    Pied de page affiché sur chaque page.
    """

    canvas.saveState()

    width, height = A4

    # Ligne
    canvas.setStrokeColor(colors.HexColor("#e5e7eb"))
    canvas.line(
        15 * mm,
        12 * mm,
        width - 15 * mm,
        12 * mm,
    )

    # Texte gauche
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(colors.HexColor("#6b7280"))

    canvas.drawString(
        15 * mm,
        7 * mm,
        "Rapport des demandes",
    )

    # Numéro de page
    canvas.drawRightString(
        width - 15 * mm,
        7 * mm,
        f"Page {doc.page}",
    )

    canvas.restoreState()


def create_summary_table(demandes, styles):
    """
    Crée le tableau récapitulatif des demandes.
    """

    total = len(demandes)

    soumises = 0
    en_traitement = 0
    approuvees = 0
    rejetees = 0
    livrees = 0

    for demande in demandes:

        statut = format_value(
            demande.get("statut")
        ).upper()

        if statut == "SOUMISE":
            soumises += 1

        elif statut == "EN_TRAITEMENT":
            en_traitement += 1

        elif statut in ["APPROUVEE1", "APPROUVEE2"]:
            approuvees += 1

        elif statut in ["REJETEE1", "REJETEE2"]:
            rejetees += 1

        elif statut == "LIVREE":
            livrees += 1

    data = [
        [
            Paragraph("<b>Total</b>", styles["normal"]),
            Paragraph("<b>Soumises</b>", styles["normal"]),
            Paragraph("<b>En traitement</b>", styles["normal"]),
            Paragraph("<b>Approuvées</b>", styles["normal"]),
            Paragraph("<b>Rejetées</b>", styles["normal"]),
            Paragraph("<b>Livrées</b>", styles["normal"]),
        ],
        [
            str(total),
            str(soumises),
            str(en_traitement),
            str(approuvees),
            str(rejetees),
            str(livrees),
        ],
    ]

    table = Table(
        data,
        colWidths=[
            25 * mm,
            25 * mm,
            35 * mm,
            30 * mm,
            30 * mm,
            25 * mm,
        ],
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#f3f4f6"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#111827"),
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#d1d5db"),
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (-1, 1),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (-1, 1),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    return table


def create_demande_table(demandes, styles):
    """
    Crée le tableau principal contenant les demandes.
    """

    header = [
        "Référence",
        "Demandeur",
        "Département",
        "Matériel",
        "Qté demandée",
        "Qté accordée",
        "Statut",
        "Date",
    ]

    data = [
        [
            Paragraph(f"<b>{column}</b>", styles["small"])
            for column in header
        ]
    ]

    for demande in demandes:

        reference = format_value(
            demande.get("reference")
        )

        demandeur = format_value(
            demande.get("demandeur")
        )

        departement = format_value(
            demande.get("departement")
        )

        materiels = format_value(
            demande.get("materiels")
        )

        qte_demandee = format_value(
            demande.get("qte_demandee")
        )

        qte_accordee = format_value(
            demande.get("qte_accordee")
        )

        statut = format_value(
            demande.get("statut")
        )

        date = format_date(
            demande.get("date_soumission")
            or demande.get("date")
        )

        data.append(
            [
                Paragraph(reference, styles["small"]),
                Paragraph(demandeur, styles["small"]),
                Paragraph(departement, styles["small"]),
                Paragraph(materiels, styles["small"]),
                Paragraph(qte_demandee, styles["small"]),
                Paragraph(qte_accordee, styles["small"]),
                Paragraph(statut, styles["small"]),
                Paragraph(date, styles["small"]),
            ]
        )

    table = Table(
        data,
        repeatRows=1,
        colWidths=[
            25 * mm,
            28 * mm,
            28 * mm,
            42 * mm,
            20 * mm,
            20 * mm,
            28 * mm,
            28 * mm,
        ],
    )

    table_style = [
        (
            "BACKGROUND",
            (0, 0),
            (-1, 0),
            colors.HexColor("#1f2937"),
        ),
        (
            "TEXTCOLOR",
            (0, 0),
            (-1, 0),
            colors.white,
        ),
        (
            "FONTNAME",
            (0, 0),
            (-1, 0),
            "Helvetica-Bold",
        ),
        (
            "ALIGN",
            (0, 0),
            (-1, -1),
            "LEFT",
        ),
        (
            "VALIGN",
            (0, 0),
            (-1, -1),
            "MIDDLE",
        ),
        (
            "GRID",
            (0, 0),
            (-1, -1),
            0.4,
            colors.HexColor("#d1d5db"),
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
        (
            "LEFTPADDING",
            (0, 0),
            (-1, -1),
            4,
        ),
        (
            "RIGHTPADDING",
            (0, 0),
            (-1, -1),
            4,
        ),
        (
            "FONTSIZE",
            (0, 0),
            (-1, -1),
            7,
        ),
    ]

    # Alternance des lignes
    for row in range(1, len(data)):

        if row % 2 == 0:
            table_style.append(
                (
                    "BACKGROUND",
                    (0, row),
                    (-1, row),
                    colors.HexColor("#f9fafb"),
                )
            )

    table.setStyle(TableStyle(table_style))

    return table


def create_detail_section(demandes, styles):
    """
    Ajoute les détails des demandes :
    justification, quantités, disponibilité et motif de rejet.
    """

    elements = []

    elements.append(
        Paragraph(
            "Détails des demandes",
            styles["section"],
        )
    )

    for index, demande in enumerate(demandes):

        reference = format_value(
            demande.get("reference")
        )

        materiels = format_value(
            demande.get("materiels")
        )

        justification = format_value(
            demande.get("justification")
        )

        qte_demandee = format_value(
            demande.get("qte_demandee")
        )

        qte_accordee = format_value(
            demande.get("qte_accordee")
        )

        qte_disponible = format_value(
            demande.get("qte_disponible")
        )

        motif_rejet = format_value(
            demande.get("motif_rejet")
        )

        statut = format_value(
            demande.get("statut")
        )

        detail_data = [
            [
                Paragraph(
                    f"<b>Référence :</b> {reference}",
                    styles["normal"],
                ),
                Paragraph(
                    f"<b>Statut :</b> {statut}",
                    styles["normal"],
                ),
            ],
            [
                Paragraph(
                    f"<b>Matériel :</b> {materiels}",
                    styles["normal"],
                ),
                Paragraph(
                    f"<b>Qté demandée :</b> {qte_demandee}",
                    styles["normal"],
                ),
            ],
            [
                Paragraph(
                    f"<b>Qté accordée :</b> {qte_accordee}",
                    styles["normal"],
                ),
                Paragraph(
                    f"<b>Qté disponible :</b> {qte_disponible}",
                    styles["normal"],
                ),
            ],
            [
                Paragraph(
                    f"<b>Justification :</b> {justification}",
                    styles["normal"],
                ),
                Paragraph(
                    f"<b>Motif de rejet :</b> {motif_rejet}",
                    styles["normal"],
                ),
            ],
        ]

        detail_table = Table(
            detail_data,
            colWidths=[
                90 * mm,
                90 * mm,
            ],
        )

        detail_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#f9fafb"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.HexColor("#d1d5db"),
                    ),
                    (
                        "INNERGRID",
                        (0, 0),
                        (-1, -1),
                        0.3,
                        colors.HexColor("#e5e7eb"),
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        elements.append(detail_table)
        elements.append(Spacer(1, 8))

        # Saut de page après quelques demandes
        if (index + 1) % 5 == 0 and index + 1 < len(demandes):
            elements.append(PageBreak())

    return elements


def generate_demandes_pdf(
    demandes,
    titre="Rapport des demandes",
    entreprise_nom=None,
    periode=None,
):
    """
    Génère le PDF des demandes.

    Parameters
    ----------
    demandes : list
        Liste des demandes retournées par le service de lecture.

    titre : str
        Titre du rapport.

    entreprise_nom : str | None
        Nom de l'entreprise.

    periode : str | None
        Période du rapport.

    Returns
    -------
    BytesIO
        PDF en mémoire prêt à être envoyé par Flask.
    """

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=15 * mm,
        bottomMargin=18 * mm,
        title=titre,
        author="Application de gestion de stock",
    )

    styles = build_styles()

    elements = []

    # =========================================================
    # TITRE
    # =========================================================

    elements.append(
        Paragraph(
            titre,
            styles["title"],
        )
    )

    # =========================================================
    # SOUS-TITRE
    # =========================================================

    informations = []

    if entreprise_nom:
        informations.append(
            f"Entreprise : {format_value(entreprise_nom)}"
        )

    if periode:
        informations.append(
            f"Période : {format_value(periode)}"
        )

    informations.append(
        f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
    )

    elements.append(
        Paragraph(
            " | ".join(informations),
            styles["subtitle"],
        )
    )

    # =========================================================
    # RÉSUMÉ
    # =========================================================

    elements.append(
        Paragraph(
            "Résumé",
            styles["section"],
        )
    )

    elements.append(
        create_summary_table(
            demandes,
            styles,
        )
    )

    elements.append(
        Spacer(1, 15)
    )

    # =========================================================
    # TABLEAU DES DEMANDES
    # =========================================================

    elements.append(
        Paragraph(
            "Liste des demandes",
            styles["section"],
        )
    )

    if demandes:

        elements.append(
            create_demande_table(
                demandes,
                styles,
            )

        )

    else:

        elements.append(
            Paragraph(
                "Aucune demande à afficher.",
                styles["normal"],
            )
        )

    elements.append(
        Spacer(1, 15)
    )

    # =========================================================
    # DÉTAILS
    # =========================================================

    if demandes:

        elements.extend(
            create_detail_section(
                demandes,
                styles,
            )
        )

    # =========================================================
    # CONSTRUCTION DU PDF
    # =========================================================

    document.build(
        elements,
        onFirstPage=footer,
        onLaterPages=footer,
    )

    buffer.seek(0)

    return buffer