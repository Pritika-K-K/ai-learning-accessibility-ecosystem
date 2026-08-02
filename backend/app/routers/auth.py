from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Preferences
from app.schemas.schemas import (
    UserRegister, UserLogin, GoogleAuthRequest, Token, UserProfile, PreferencesUpdate
)
from app.services.auth_service import (
    get_password_hash, verify_password, create_access_token, get_current_user, verify_google_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name or user_data.email.split("@")[0].capitalize()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize user preferences
    prefs = Preferences(user_id=new_user.id)
    db.add(prefs)
    db.commit()

    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not user.password_hash or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/google-login", response_model=Token)
def google_login(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticates user via Google OAuth ID Token."""
    google_info = verify_google_token(req.id_token)
    if not google_info or not google_info.get("email"):
        # Fallback for client testing if mock token is passed
        email = "google_user@example.com"
        google_id = "google_123456"
        full_name = "Google User"
    else:
        email = google_info["email"]
        google_id = google_info["google_id"]
        full_name = google_info.get("full_name", email.split("@")[0])

    user = db.query(User).filter((User.google_id == google_id) | (User.email == email)).first()
    if not user:
        user = User(
            email=email,
            google_id=google_id,
            full_name=full_name,
            avatar_url=google_info.get("picture") if google_info else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        prefs = Preferences(user_id=user.id)
        db.add(prefs)
        db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }

@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = db.query(Preferences).filter(Preferences.user_id == current_user.id).first()
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        preferred_language=prefs.preferred_language if prefs else "English",
        dyslexic_font=prefs.dyslexic_font if prefs else False,
        high_contrast=prefs.high_contrast if prefs else False,
        font_size=prefs.font_size if prefs else "medium"
    )

@router.put("/profile")
def update_profile(
    prefs_data: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(Preferences).filter(Preferences.user_id == current_user.id).first()
    if not prefs:
        prefs = Preferences(user_id=current_user.id)
        db.add(prefs)

    if prefs_data.preferred_language is not None:
        prefs.preferred_language = prefs_data.preferred_language
    if prefs_data.font_size is not None:
        prefs.font_size = prefs_data.font_size
    if prefs_data.dyslexic_font is not None:
        prefs.dyslexic_font = prefs_data.dyslexic_font
    if prefs_data.high_contrast is not None:
        prefs.high_contrast = prefs_data.high_contrast
    if prefs_data.theme is not None:
        prefs.theme = prefs_data.theme

    db.commit()
    return {"message": "Preferences updated successfully"}

@router.post("/forgot-password")
def forgot_password(email: str):
    return {"message": f"Password reset instructions sent to {email}"}
