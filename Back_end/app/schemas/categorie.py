from marshmallow import Schema, fields, validate


class CategorieBaseSchema(Schema):
    nom = fields.Str(required=True)
    description = fields.Str(required=True)


class CategorieCreateSchema(CategorieBaseSchema):
    pass


class CategorieResponseSchema(CategorieBaseSchema):
    id = fields.Int(dump_only=True)  # lecture seule (équivalent à orm_mode)


class CategorieUpdateSchema(Schema):
    nom = fields.Str(load_default=None)        # Optional
    description = fields.Str(load_default=None) # Optional