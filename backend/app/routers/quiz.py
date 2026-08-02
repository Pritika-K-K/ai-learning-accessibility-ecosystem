import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, Quiz
from app.schemas.schemas import QuizGenerateRequest, QuizResponse
from app.services.auth_service import get_current_user
from app.services.quiz_service import generate_quiz_questions

router = APIRouter(prefix="", tags=["Smart Quiz Generator"])

@router.post("/quiz", response_model=QuizResponse)
def create_quiz(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == req.document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text = doc.original_text or doc.summary_text or "General educational content."
    questions = generate_quiz_questions(
        text, 
        difficulty=req.difficulty or "Medium", 
        question_count=req.question_count or 5,
        target_language=req.target_language or "English"
    )

    quiz = Quiz(
        document_id=doc.id,
        title=f"Quiz: {doc.title}",
        difficulty=req.difficulty or "Medium",
        questions_json=json.dumps(questions)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return QuizResponse(
        id=quiz.id,
        document_id=quiz.document_id,
        title=quiz.title,
        difficulty=quiz.difficulty,
        questions=questions
    )

@router.get("/quizzes/{document_id}")
def get_quizzes_by_document(document_id: int, db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).filter(Quiz.document_id == document_id).all()
    result = []
    for q in quizzes:
        result.append({
            "id": q.id,
            "title": q.title,
            "difficulty": q.difficulty,
            "questions": json.loads(q.questions_json),
            "created_at": q.created_at.isoformat()
        })
    return result
