from marshmallow import Schema, fields


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CREATE — lier un user à une entreprise
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class UserEntrepriseCreateSchema(Schema):
    user_id = fields.Int(required=True)
    entreprise_id = fields.Int(required=True)
    role_entreprise = fields.Str(required=True)
    is_active = fields.Bool(load_default=True)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UPDATE — modification partielle
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class UserEntrepriseUpdateSchema(Schema):
    role_entreprise = fields.Str(load_default=None)
    is_active = fields.Bool(load_default=None)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# READ — réponse API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class UserEntrepriseResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    entreprise_id = fields.Int(dump_only=True)
    role_entreprise = fields.Str(dump_only=True)
    is_active = fields.Bool(dump_only=True)