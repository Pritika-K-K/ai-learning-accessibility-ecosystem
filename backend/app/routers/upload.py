import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.models import User, Document
from app.schemas.schemas import DocumentResponse, TextUploadRequest, UrlUploadRequest
from app.services.auth_service import get_current_user
from app.services.pdf_service import extract_text_from_file

router = APIRouter(prefix="", tags=["Upload Center"])

@router.post("/upload", response_model=DocumentResponse)
async def upload_file(
    file: UploadFile = File(...),
    subject: str = Form("General"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "txt"
    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    extracted_text = extract_text_from_file(file_path, ext)
    summary_text = f"Summary of {file.filename}:\n" + (extracted_text[:300] + "..." if len(extracted_text) > 300 else extracted_text)
    simplified_text = f"Key takeaway from {file.filename}:\n" + extracted_text[:250]

    doc = Document(
        user_id=current_user.id,
        title=file.filename,
        file_path=file_path,
        file_type=ext,
        file_size=len(contents),
        original_text=extracted_text,
        summary_text=summary_text,
        simplified_text=simplified_text,
        status="Ready",
        subject=subject,
        accessibility_score=88
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/upload/text", response_model=DocumentResponse)
def upload_raw_text(
    req: TextUploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    summary = f"Summary: {req.text[:200]}..." if len(req.text) > 200 else req.text
    simplified = f"Key points:\n• {req.text[:150]}"
    doc = Document(
        user_id=current_user.id,
        title=req.title,
        file_type="txt",
        file_size=len(req.text.encode('utf-8')),
        original_text=req.text,
        summary_text=summary,
        simplified_text=simplified,
        status="Ready",
        subject=req.subject or "General",
        accessibility_score=90
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/documents")
def get_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.is_trashed == False
    ).order_by(Document.created_at.desc()).all()

@router.delete("/document/{doc_id}")
def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.is_trashed = True
    db.commit()
    return {"message": "Document moved to trash"}
