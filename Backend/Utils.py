import os

import bcrypt
from jose import jwt

ALGORITHM = "HS256"

# A single, shared secret used to both create and verify tokens.
# Set JWT_SECRET_KEY in your .env file for anything beyond local testing.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")


def hash_password(password: str) -> str:
    """Hash a plain-text password for storing."""
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """Check a plain-text password against a stored bcrypt hash."""
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(data: dict, secret_key: str = SECRET_KEY) -> str:
    """Create a signed JWT."""
    return jwt.encode(data, secret_key, algorithm=ALGORITHM)


def decode_token(token: str, secret_key: str = SECRET_KEY) -> dict:
    """Decode/verify a JWT. Returns {'error': ...} if invalid or expired."""
    try:
        return jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    except Exception as e:
        return {"error": str(e)}
