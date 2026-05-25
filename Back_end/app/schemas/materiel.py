from marshmallow import Schema, fields


class MaterielBaseSchema(Schema):
    reference = fields.Str(required=True)
    categorie = fields.Str(required=True)
    designation = fields.Str(required=True)
    unite = fields.Str(required=True)


class MaterielResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    reference = fields.Str(dump_only=True)
    designation = fields.Str(dump_only=True)
    unite = fields.Str(dump_only=True)
    categorie_id = fields.Int(dump_only=True)


class MaterielListResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    categorie = fields.Str(dump_only=True)
    reference = fields.Str(dump_only=True)
    designation = fields.Str(dump_only=True)
    unite = fields.Str(dump_only=True)
    entreprise_id = fields.Int(dump_only=True)


class MaterielUpdateSchema(Schema):
    reference = fields.Str(load_default=None)
    designation = fields.Str(load_default=None)
    unite = fields.Str(load_default=None)
    categorie_id = fields.Int(load_default=None)  # ← Optional[int] | Optional[str] simplifié en Int