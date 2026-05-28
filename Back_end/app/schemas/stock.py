from marshmallow import Schema, fields


class StockBaseSchema(Schema):
    quantite = fields.Int(required=True)
    materiel = fields.Str(required=True)
    departement_id = fields.Int(load_default=None)


class StockCreateSchema(StockBaseSchema):
    pass


class StockResponseSchema(Schema):
    pass  # vide comme dans l'original


class StockListResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    materiel_id = fields.Int(dump_only=True)
    quantite_actuelle = fields.Int(dump_only=True)
    seuil_alerte = fields.Int(dump_only=True)
    departement = fields.Str(dump_only=True)
    categorie = fields.Str(dump_only=True)
    reference = fields.Str(dump_only=True)
    designation = fields.Str(dump_only=True)



class StockUpdateSchema(Schema):
    quantite_actuelle = fields.Int(load_default=None)
    designation = fields.Str(load_default=None)
    departement_id = fields.Int(load_default=None)