from marshmallow import Schema, fields, validate


class CategorieBaseSchema(Schema):
    nom = fields.Str(required=True)
    description = fields.Str(required=True)


class CategorieCreateSchema(CategorieBaseSchema):
    pass


class CategorieResponseSchemaAdmin(CategorieBaseSchema):
    id = fields.Int(dump_only=True)  # lecture seule (équivalent à orm_mode)
    departement = fields.Str(dump_only=True)  # Champ pour le nom du département associé
    categorie_description = fields.Str(dump_only=True)  # Champ pour la description de la
    categorie = fields.Str(dump_only=True)  # Champ pour le nom de la catégorie

class CategorieResponseSchema(CategorieBaseSchema):
    id = fields.Int(dump_only=True)  # lecture seule (équivalent à orm_mode)
    #departement = fields.Str(dump_only=True)  # Champ pour le nom du département associé


class CategorieUpdateSchema(Schema):
    nom = fields.Str(load_default=None)        # Optional
    description = fields.Str(load_default=None) # Optional
