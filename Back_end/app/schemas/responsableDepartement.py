from marshmallow import Schema, fields


class ResponsableDepartementBaseSchema(Schema):
    nom = fields.Str()


class ResponsableDepartementCreateSchema(ResponsableDepartementBaseSchema):
    user_nom = fields.Str(required=True)
    departement_nom = fields.Str(required=True)


class ResponsableDepartementResponseSchema(ResponsableDepartementCreateSchema):
    pass

class ResponsableDepartementUpdateSchema(Schema):
    user_id = fields.Int(required=True)
    departement_id = fields.Int(required=True)
    old_user_name = fields.Str(load_default=None)

