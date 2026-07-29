from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

# 1. Définir la convention de nommage
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

# 2. Assigner la convention au MetaData de la classe de base 2.0
class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=convention)

# 3. Initialiser SQLAlchemy avec ta classe Base configurée
db = SQLAlchemy(model_class=Base)