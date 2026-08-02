from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.models import User, Document
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/library", tags=["Learning Library"])

@router.get("")
def get_library_items(
    subject: Optional[str] = None,
    favorite_only: Optional[bool] = False,
    trashed: Optional[bool] = False,
    query: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_query = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.is_trashed == (True if trashed else False)
    )

    if subject:
        db_query = db_query.filter(Document.subject == subject)
    if favorite_only:
        db_query = db_query.filter(Document.is_favorite == True)
    if query:
        db_query = db_query.filter(Document.title.ilike(f"%{query}%"))

    docs = db_query.order_by(Document.created_at.desc()).all()
    return docs

@router.post("/toggle-favorite/{doc_id}")
def toggle_favorite(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.is_favorite = not doc.is_favorite
    db.commit()
    return {"id": doc.id, "is_favorite": doc.is_favorite}

@router.post("/restore/{doc_id}")
def restore_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.is_trashed = False
    db.commit()
    return {"message": "Document restored from trash"}
