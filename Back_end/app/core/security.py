from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from flask import current_app

# Configuration du hashing des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class HashHelper:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Vérifie qu'un mot de passe correspond à son hash."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Génère le hash bcrypt d'un mot de passe."""
        return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crée un token JWT."""
    secret_key = current_app.config["SECRET_KEY"]
    algorithm = current_app.config["JWT_ALGORITHM"]
    expire_minutes = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"] // 60

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Décode et valide un token JWT."""
    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=[current_app.config["JWT_ALGORITHM"]]
        )
        return payload
    except JWTError:
        return None