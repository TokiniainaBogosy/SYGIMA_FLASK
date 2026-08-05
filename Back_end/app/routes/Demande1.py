from flask import Blueprint, request, jsonify
from typing import Optional
from app.schemas.ligneDemande import CreateDemandeGlobalSchema
from app.schemas.demande import DemandeResponseSchema, DemandeListResponseSchema, StatusUpdateSchema
from app.services.create_demande_service import create_demande
from app.services.answer_demande_service import modifier_statut_demande
from app.services.read_demande_list_Departement import read_demande_global
from app.services.read_demande_list_service import read_demande_list, read_demande_list_departement
from app.utils.auth import get_current_user , get_current_user_entreprise
from app.utils.notifications import send_notification
from app.utils.audit import inscrire_historique


demande_bp = Blueprint("demande", __name__, url_prefix="/demande")


@demande_bp.route("/", methods=["POST"])
def create_demande_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()

    data = CreateDemandeGlobalSchema().load(request.get_json())
    demande = create_demande(data, current_user, current_user_entreprise)

    departement = current_user.departement

    # Vérifier qu'il y a un département et un responsable
    if departement and departement.responsables:

        responsable = departement.responsables[0].user  # unique responsable

        message = (
            f"{current_user.prenom} {current_user.nom} "
            f"a soumis une nouvelle demande (Réf: {demande.reference})"
        )

        inscrire_historique(
                action="SOUMISSION",
                objet_cible=demande,
                user_id=current_user.id,
                entreprise_id=current_user_entreprise.entreprise_id,  
                details={
                    "nouveau_statut": demande.statut.value
                }
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


@demande_bp.route("/", methods=["GET"])
def read_demande_list_route():
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    limit = request.args.get("limit", None, type=int)  # ← query param optionnel
    result = read_demande_list(current_user, current_user_entreprise, limit)
    return jsonify(DemandeListResponseSchema(many=True).dump(result)), 200


@demande_bp.route("/<int:departement_id>", methods=["GET"])
def read_demande_list_departement_route(departement_id: int):
    current_user = get_current_user()
    current_user_entreprise = get_current_user_entreprise()
    result = read_demande_list_departement(current_user, current_user_entreprise,departement_id)
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

    ligne_demande,db_demande = modifier_statut_demande(data, current_user,current_user_entreprise)

    # Inscription dans l'historique d'actions
    # On passe le nouveau statut dans le champ 'details' pour garder une trace textuelle claire
    inscrire_historique(
        action="TRAITEMENT",
        objet_cible=ligne_demande,
        user_id=current_user.id,
        entreprise_id=current_user_entreprise.entreprise_id,  
        details={
            "nouveau_statut": ligne_demande.statut_ligne.value
        }
    )

    # notifier le demandeur
    send_notification(
        user_id=db_demande.demandeur_id,
        entreprise_id=current_user_entreprise.id,
        message=f"Votre demande a été {ligne_demande.statut_ligne.value.lower()} par {current_user.prenom}",
        notification_type="info",
        departement_id=db_demande.departement_id,
        sender_id=current_user.id
    )
    print(ligne_demande)  

    return jsonify(DemandeListResponseSchema().dump(ligne_demande)), 200