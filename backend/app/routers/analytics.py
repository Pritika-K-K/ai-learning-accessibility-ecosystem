from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, Quiz, Translation
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_docs = db.query(Document).filter(Document.user_id == current_user.id).count()
    total_quizzes = db.query(Quiz).join(Document).filter(Document.user_id == current_user.id).count()

    return {
        "learning_hours": 18.5,
        "documents_processed": total_docs,
        "quizzes_completed": total_quizzes,
        "accessibility_improvement": "+24%",
        "language_distribution": [
            {"language": "English", "percentage": 40},
            {"language": "Hindi", "percentage": 25},
            {"language": "Tamil", "percentage": 20},
            {"language": "Telugu", "percentage": 15}
        ],
        "learning_progress_trend": [
            {"day": "Mon", "hours": 2.5, "score": 82},
            {"day": "Tue", "hours": 3.0, "score": 85},
            {"day": "Wed", "hours": 1.8, "score": 88},
            {"day": "Thu", "hours": 4.2, "score": 91},
            {"day": "Fri", "hours": 3.5, "score": 93},
            {"day": "Sat", "hours": 2.0, "score": 95},
            {"day": "Sun", "hours": 1.5, "score": 96}
        ]
    }
