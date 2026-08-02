from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import requests

from app.config import settings
from app.database import get_db
from app.models.models import User, Preferences

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please sign in to continue.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise credentials_exception
        return user
    except Exception as e:
        print(f"[Auth Error] Token validation failed: {e}")
        raise credentials_exception


def verify_google_token(id_token: str) -> dict:
    """Verifies Google OAuth ID Token using Google tokeninfo endpoint."""
    try:
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            info = resp.json()
            return {
                "email": info.get("email"),
                "google_id": info.get("sub"),
                "full_name": info.get("name"),
                "picture": info.get("picture")
            }
    except Exception as e:
        print(f"[Google OAuth Error] Token verification error: {e}")
    return None
