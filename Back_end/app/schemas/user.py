from marshmallow import Schema, fields
from app.models.User import RoleUser

# 1. Utilisation du champ natif fields.Enum avec by_value=True
# Cela gère AUTOMATIQUEMENT le load et le dump sous forme de chaîne simple ("ADMIN")
class UserBaseSchema(Schema):
    email = fields.Email(required=True)
    nom = fields.Str(required=True)
    prenom = fields.Str(required=True)
    role = fields.Enum(RoleUser, by_value=True, required=True)


class UserCreateSchema(UserBaseSchema):
    password = fields.Str(required=True)
    departement_id = fields.Str(load_default=None)
    role = fields.Str(required=True)

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UserResponseSchema(UserBaseSchema):
    id = fields.Int(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    departement_id = fields.Int(load_default=None)


class TokenSchema(Schema):
    access_token = fields.Str(dump_only=True)
    token_type = fields.Str(dump_only=True, load_default="bearer")
    user = fields.Nested(UserResponseSchema, dump_only=True)


# 2. Nettoyage de UserListResponseSchema
# Remplacement de fields.Str + @post_dump par le champ Enum natif
class UserListResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    nom = fields.Str(dump_only=True)
    prenom = fields.Str(dump_only=True)
    email = fields.Email(dump_only=True)
    role = fields.Enum(RoleUser, by_value=True, dump_only=True) # Corrigé ici
    departement = fields.Str(dump_only=True)
    is_active = fields.Int(dump_only=True)
    created_at = fields.DateTime(load_default=None, dump_only=True)
