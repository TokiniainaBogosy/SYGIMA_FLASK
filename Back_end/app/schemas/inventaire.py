from marshmallow import Schema, fields


class StockBaseSchema(Schema):
    quantite = fields.Int(required=True)
    materiel = fields.Str(required=True)
    departement_id = fields.Int(load_default=None)


class StockCreateSchema(StockBaseSchema):
    pass


class StockResponseSchema(Schema):
    pass  # vide comme dans l'original


class InventaireResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    materiel_id = fields.Int(dump_only=True)
    quantite = fields.Int(dump_only=True)
    seuil_alerte = fields.Int(dump_only=True)
    departement = fields.Str(dump_only=True)
    categorie = fields.Str(dump_only=True)
    reference = fields.Str(dump_only=True)
    designation = fields.Str(dump_only=True)
    unite = fields.Str(dump_only=True)
    employe_nom = fields.Str(dump_only=True)
    employe_prenom = fields.Str(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)  # Ajout du champ updated_at pour InventaireEmploye

    
            
class StockUpdateSchema(Schema):
    quantite_actuelle = fields.Int(load_default=None)
    designation = fields.Str(load_default=None)
    departement_id = fields.Int(load_default=None)