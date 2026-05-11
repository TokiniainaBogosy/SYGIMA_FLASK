from marshmallow import Schema, fields, validate


class EntrepriseCreateSchema(Schema):
    nom = fields.Str(required=True)
    code = fields.Str(required=True)
    adresse = fields.Str(load_default=None)
    logo_url = fields.Str(load_default=None)


class AdminCreateSchema(Schema):
    nom = fields.Str(required=True)
    prenom = fields.Str(required=True)
    email = fields.Email(required=True)  # ← équivalent de EmailStr
    password = fields.Str(required=True)
    role = fields.Str(load_default="Admin")


class SetupRequestSchema(Schema):
    entreprise = fields.Nested(EntrepriseCreateSchema, required=True)  # ← équivalent de sous-modèle Pydantic
    admin = fields.Nested(AdminCreateSchema, required=True)


class EntrepriseResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    nom = fields.Str(dump_only=True)
    code = fields.Str(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


class SetupResponseSchema(Schema):
    status = fields.Str(dump_only=True)
    message = fields.Str(dump_only=True)
    entreprise_id = fields.Int(dump_only=True)