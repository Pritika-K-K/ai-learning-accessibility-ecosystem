from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, Quiz, AudioCaption, Preferences
from app.services.auth_service import get_current_user

router = APIRouter(prefix="", tags=["Dashboard"])

@router.get("/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc_count = db.query(Document).filter(Document.user_id == current_user.id, Document.is_trashed == False).count()
    quiz_count = db.query(Quiz).join(Document).filter(Document.user_id == current_user.id).count()
    audio_count = db.query(AudioCaption).join(Document).filter(Document.user_id == current_user.id).count()
    prefs = db.query(Preferences).filter(Preferences.user_id == current_user.id).first()

    return {
        "user_name": current_user.full_name or "Student",
        "today_progress": 78,  # percentage
        "accessibility_score": 92,
        "preferred_language": prefs.preferred_language if prefs else "English",
        "documents_uploaded": doc_count,
        "audio_generated": audio_count,
        "quizzes_created": quiz_count,
        "hours_learned": 14.5
    }

@router.get("/recent")
def get_recent(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(
        Document.user_id == current_user.id, 
        Document.is_trashed == False
    ).order_by(Document.created_at.desc()).limit(5).all()

    return [
        {
            "id": doc.id,
            "title": doc.title,
            "file_type": doc.file_type,
            "status": doc.status,
            "created_at": doc.created_at.isoformat(),
            "pipeline_status": "Translated → Audio Ready → Quiz Generated"
        }
        for doc in docs
    ]
