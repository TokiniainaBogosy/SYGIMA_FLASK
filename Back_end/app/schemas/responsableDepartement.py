from marshmallow import Schema, fields


class ResponsableDepartementBaseSchema(Schema):
    nom = fields.Str(required=True)


class ResponsableDepartementCreateSchema(ResponsableDepartementBaseSchema):
    user_nom = fields.Str(required=True)
    departement_nom = fields.Str(required=True)


class ResponsableDepartementResponseSchema(Schema):
    departement = fields.Str(dump_only=True)