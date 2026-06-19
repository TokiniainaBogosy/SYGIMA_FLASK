from marshmallow import Schema, fields
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
    BROUILLON = "BROUILLON"  # ← typo corrigée (BROULLION → BROUILLON)



class LigneDemandeBaseSchema(Schema):
    demande_id = fields.Int(required=True)
    materiel_id = fields.Int(required=True)
    qte_demandee = fields.Int(required=True)


class LigneDemandeCreateSchema(Schema):
    type_materiel = fields.Str(required=True)
    quantite = fields.Int(required=True)


class LigneDemandeResponseSchema(LigneDemandeBaseSchema):
    id = fields.Int(dump_only=True)
    qte_accordee = fields.Int(dump_only=True)


class CreateDemandeGlobalSchema(Schema):
    justification = fields.Str(required=True)
    date_souhaitee = fields.Str(required=True)
    lignes = fields.List(fields.Nested(LigneDemandeCreateSchema), required=True)  # ← équivalent de List[LigneDemandeCreate]