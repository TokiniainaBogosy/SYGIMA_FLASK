from marshmallow import Schema, fields
from marshmallow_enum import EnumField
from enum import Enum


class StatutDemande(str, Enum):
    SOUMISE = "SOUMISE"
    EN_TRAITEMENT = "EN_TRAITEMENT"
    APPROUVEE1 = "APPROUVEE1"
    APPROUVEE2 = "APPROUVEE2"
    REJETEE1 = "REJETEE1"
    REJETEE2 = "REJETEE2"
    EN_ATTENTE_STOCK = "EN_ATTENTE_STOCK"
    LIVREE = "LIVREE"
    BROUILLON = "BROUILLON"


class DemandeBaseSchema(Schema):
    reference = fields.Str(required=True)


class DemandeCreateSchema(DemandeBaseSchema):
    justification = fields.Str(required=True)
    date_souhaitee = fields.Str(required=True)


class DemandeTraitementSchema(DemandeBaseSchema):
    statut = fields.Str(required=True)
    traite_par = fields.Int(required=True)
    date_traitement = fields.DateTime(required=True)
    motif_rejet = fields.Str(required=True)


class DemandeResponseSchema(DemandeBaseSchema):
    id = fields.Int(dump_only=True)
    numero_demande = fields.Method("get_numero_demande", dump_only=True)
    statut = EnumField(StatutDemande, dump_only=True)
    demandeur_id = fields.Int(dump_only=True)
    departement_id = fields.Int(dump_only=True)
    responsable_id = fields.Int(dump_only=True)
    date_soumission = fields.DateTime(dump_only=True)
    motif_rejet = fields.Str(load_default=None)
    traite_par = fields.Int(load_default=None)
    date_traitement = fields.DateTime(load_default=None)

    def get_numero_demande(self, obj):
        return getattr(obj, "reference", None)


class DemandeListResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    ligne_id = fields.Int(load_default=None)
    qte_accordee = fields.Int(load_default=None)
    statut_ligne = EnumField(StatutDemande, load_default=None)
    reference = fields.Str(dump_only=True)
    demandeur = fields.Str(dump_only=True)
    departement = fields.Str(dump_only=True)
    statut = EnumField(StatutDemande, load_default=None)
    date = fields.DateTime(dump_only=True)
    date_soumission = fields.DateTime(dump_only=True)
    date_traitement = fields.DateTime(dump_only=True)
    materiels = fields.Str(dump_only=True)
    justification = fields.Str(dump_only=True)
    qte_disponible = fields.Int(dump_only=True)
    qte_demandee = fields.Int(dump_only=True)
    motif_rejet = fields.Str(dump_only=True)


class StatusUpdateSchema(Schema):
    status = EnumField(StatutDemande, load_default=None)
    ligne_id = fields.Int(load_default=None)
    reference = fields.Str(load_default=None)
    motif = fields.Str(load_default=None)