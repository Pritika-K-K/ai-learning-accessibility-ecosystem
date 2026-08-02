from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, ChatHistory
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.auth_service import get_current_user
from app.services.chatbot_service import answer_document_question
from app.services.translate_service import translate_text

router = APIRouter(prefix="", tags=["AI Study Assistant / Document Chat"])

@router.post("/chat", response_model=ChatResponse)
def document_chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == req.document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text = doc.original_text or doc.summary_text or ""
    raw_answer = answer_document_question(text, req.question, simplify=req.simplify or False)

    # Translate answer on the spot if target_language is set and not English
    translated_ans = None
    if req.target_language and req.target_language.lower() != "english":
        translated_ans = translate_text(raw_answer, req.target_language)

    chat_entry = ChatHistory(
        user_id=current_user.id,
        document_id=doc.id,
        question=req.question,
        answer=raw_answer,
        target_language=req.target_language or "English"
    )
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)

    return ChatResponse(
        id=chat_entry.id,
        question=chat_entry.question,
        answer=chat_entry.answer,
        target_language=chat_entry.target_language,
        translated_answer=translated_ans or raw_answer
    )

@router.get("/chat/history/{document_id}")
def get_chat_history(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(ChatHistory).filter(
        ChatHistory.document_id == document_id,
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.asc()).all()
