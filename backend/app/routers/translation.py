from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, Translation
from app.schemas.schemas import TranslateRequest, TranslationResponse
from app.services.auth_service import get_current_user
from app.services.translate_service import translate_text

router = APIRouter(prefix="", tags=["Translation Center"])

@router.post("/translate", response_model=TranslationResponse)
def translate_document(
    req: TranslateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == req.document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text_to_translate = req.text_override or doc.original_text or doc.summary_text or ""
    translated = translate_text(text_to_translate, req.target_language)

    # Check existing version count
    prev_count = db.query(Translation).filter(
        Translation.document_id == doc.id,
        Translation.target_language == req.target_language
    ).count()

    trans = Translation(
        document_id=doc.id,
        target_language=req.target_language,
        translated_text=translated,
        version=prev_count + 1
    )
    db.add(trans)
    db.commit()
    db.refresh(trans)
    return trans

@router.get("/translations/{document_id}")
def get_translations(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Translation).filter(Translation.document_id == document_id).order_by(Translation.version.desc()).all()
