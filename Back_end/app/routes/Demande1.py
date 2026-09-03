from flask import Blueprint, request, jsonify, send_file
from typing import Optional
from app.schemas.ligneDemande import CreateDemandeGlobalSchema
from app.schemas.demande import DemandeResponseSchema, DemandeListResponseSchema, StatusUpdateSchema
from app.services.create_demande_service import create_demande
from app.services.answer_demande_service import modifier_statut_demande
from app.services.read_demande_list_Departement import read_demande_global
from app.services.read_demande_list_service import read_demande_list, read_demande_list_departement
from app.utils.auth import get_current_user, get_current_user_entreprise
from app.utils.notifications import send_notification
from app.utils.audit import inscrire_historique
from app.services.pdf.demande_pdf_service import generate_demandes_pdf


demande_bp = Blueprint("demande", __name__, url_prefix="/demande")


@demande_bp.route("/", methods=["POST"])
def create_demande_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    data = CreateDemandeGlobalSchema().load(request.get_json())
    demande = create_demande(data, current_user, current_user_entreprise)

    # BUG CORRIGÉ : la journalisation était imbriquée dans le `if` de notification,
    # donc une demande créée dans un département sans responsable n'était jamais
    # inscrite dans l'historique. La journalisation doit être inconditionnelle.
    inscrire_historique(
        action="SOUMISSION",
        objet_cible=demande,
        user_id=current_user.id,
        entreprise_id=current_user_entreprise.entreprise_id,
        details={
            "nouveau_statut": demande.statut.value
        }
    )

    departement = current_user.departement

    # La notification, elle, dépend bien de l'existence d'un responsable
    if departement and departement.responsables:
        responsable = departement.responsables[0].user  # unique responsable

        message = (
            f"{current_user.prenom} {current_user.nom} "
            f"a soumis une nouvelle demande (Réf: {demande.reference})"
        )

        send_notification(
            user_id=responsable.id,
            entreprise_id=current_user_entreprise.id,
            message=message,
            notification_type="info",
            departement_id=departement.id,
            sender_id=current_user.id
        )

    return jsonify(DemandeResponseSchema().dump(demande)), 201


@demande_bp.route("/pdf", methods=["GET"])
def export_demandes_pdf():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    demandes = read_demande_list(current_user, current_user_entreprise, None)

    pdf = generate_demandes_pdf(
        demandes=demandes,
        titre="Rapport des demandes",
        entreprise_nom=current_user_entreprise.entreprise.nom,
        periode="Toutes les demandes"
    )

    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="rapport_demandes.pdf"
    )


@demande_bp.route("/", methods=["GET"])
def read_demande_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    limit = request.args.get("limit", None, type=int)
    result = read_demande_list(current_user, current_user_entreprise, limit)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/<int:departement_id>", methods=["GET"])
def read_demande_list_departement_route(departement_id: int):
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_demande_list_departement(current_user, current_user_entreprise, departement_id)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/departement/global", methods=["GET"])
def read_demande_list_departement_global_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_demande_global(current_user, current_user_entreprise)
    return jsonify(result), 200


@demande_bp.route("/answer", methods=["PATCH"])
def answer_demande_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    data = StatusUpdateSchema().load(request.get_json())

    # BUG CORRIGÉ : modifier_statut_demande() retourne désormais TOUJOURS
    # (ligne_demande, db_demande) — plus jamais une réponse HTTP directe —
    # donc ce désempaquetage ne peut plus recevoir un objet Response.
    ligne_demande, db_demande = modifier_statut_demande(data, current_user, current_user_entreprise)

    inscrire_historique(
        action="TRAITEMENT",
        objet_cible=ligne_demande,
        user_id=current_user.id,
        entreprise_id=current_user_entreprise.entreprise_id,
        details={
            "nouveau_statut": ligne_demande.statut_ligne.value
        }
    )

    send_notification(
        user_id=db_demande.demandeur_id,
        entreprise_id=current_user_entreprise.id,
        message=f"Votre demande a été {ligne_demande.statut_ligne.value.lower()} par {current_user.prenom}",
        notification_type="info",
        departement_id=db_demande.departement_id,
        sender_id=current_user.id
    )

    # Le statut demandé ("LIVREE") peut avoir été réorienté vers EN_ATTENTE_STOCK
    # si le stock était insuffisant : on le signale au front avec un 202
    # plutôt qu'un 200 classique, sans que ça ait cassé le flux.
    statut_demande_client = data.get("status")
    stock_insuffisant = (
        statut_demande_client == "LIVREE"
        and ligne_demande.statut_ligne.value == "EN_ATTENTE_STOCK"
    )

    reponse = DemandeListResponseSchema().dump(ligne_demande)
    if stock_insuffisant:
        reponse["warning"] = "Stock insuffisant, ligne mise en attente de réapprovisionnement."
        return jsonify(reponse), 202

    return jsonify(reponse), 200