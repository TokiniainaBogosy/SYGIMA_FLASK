from marshmallow import Schema, fields


class HistoriqueActionResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    action = fields.Str(dump_only=True)
    table_cible = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    details = fields.Dict(keys=fields.Str(), values=fields.Raw(), dump_only=True)
    utilisateur = fields.Str(dump_only=True)
    




    
