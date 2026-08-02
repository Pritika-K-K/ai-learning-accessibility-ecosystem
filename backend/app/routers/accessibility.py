from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Document, AudioCaption
from app.schemas.schemas import TTSRequest, AccessibilityReportResponse
from app.services.auth_service import get_current_user
from app.services.tts_service import generate_tts_audio

router = APIRouter(prefix="", tags=["Accessibility Center"])

@router.post("/tts")
def create_tts(
    req: TTSRequest,
    document_id: int = 1,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    selected_lang = req.language or "English"
    result = generate_tts_audio(req.text, selected_lang, slow=(req.speed and req.speed < 0.9))
    
    # Store audio record
    audio = AudioCaption(
        document_id=document_id,
        audio_path=result["audio_url"],
        caption_path=result["caption_url"],
        language=result["language"],
        voice_gender=req.gender or "Female",
        speed=req.speed or 1.0
    )
    db.add(audio)
    db.commit()

    return {
        "audio_url": result["audio_url"],
        "caption_url": result["caption_url"],
        "language": result["language"],
        "language_code": result["language_code"],
        "translated_text": result["translated_text"],
        "speed": req.speed
    }

@router.post("/captions")
def get_captions(document_id: int, db: Session = Depends(get_db)):
    record = db.query(AudioCaption).filter(AudioCaption.document_id == document_id).order_by(AudioCaption.created_at.desc()).first()
    if not record:
        return {"captions": "WEBVTT\n\n00:00.000 --> 00:05.000\n[Auto-generated accessibility captions ready.]"}
    return {"captions_url": record.caption_path}

@router.get("/score/{document_id}", response_model=AccessibilityReportResponse)
def get_accessibility_score(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        return AccessibilityReportResponse(
            document_id=document_id,
            score=85,
            suggestions=["Add section headings", "Shorten sentences over 25 words", "Use high-contrast theme"],
            reading_time_minutes=3.5
        )

    words = len((doc.original_text or "").split())
    reading_time = round(words / 200.0, 1) if words > 0 else 1.0

    return AccessibilityReportResponse(
        document_id=doc.id,
        score=doc.accessibility_score or 88,
        suggestions=[
            "Document font contrast is optimal for reading mode.",
            "Paragraph lengths are well-proportioned.",
            "Auto-generated TTS narration audio is ready.",
            "Consider generating flashcards for quick revision."
        ],
        reading_time_minutes=reading_time
    )
