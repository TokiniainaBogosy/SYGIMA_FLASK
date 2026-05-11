from marshmallow import Schema, fields


class DepartementBaseSchema(Schema):
    nom = fields.Str(required=True)
    code = fields.Str(required=True)


class DepartementCreateSchema(DepartementBaseSchema):
    pass


class DepartementResponseSchema(DepartementBaseSchema):
    id = fields.Int(dump_only=True)