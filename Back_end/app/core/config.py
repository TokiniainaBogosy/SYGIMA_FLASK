import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Base de données
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Sécurité
    SECRET_KEY = os.getenv("SECRET_KEY")

    # JWT (flask-jwt-extended)
    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ALGORITHM = os.getenv("ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480)) * 60  # en secondes