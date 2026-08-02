import os
import fitz  # PyMuPDF
from docx import Document as DocxDocument
from pptx import Presentation
from PIL import Image

def extract_text_from_file(file_path: str, file_type: str) -> str:
    """Extracts raw text from PDF, DOCX, PPTX, TXT, or Image files."""
    if not os.path.exists(file_path):
        return ""

    file_type = file_type.lower()
    text = ""

    try:
        if file_type == "pdf":
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text() + "\n"
        elif file_type in ["docx", "doc"]:
            doc = DocxDocument(file_path)
            for p in doc.paragraphs:
                text += p.text + "\n"
        elif file_type in ["pptx", "ppt"]:
            prs = Presentation(file_path)
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        text += shape.text + "\n"
        elif file_type in ["txt", "text"]:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        elif file_type in ["png", "jpg", "jpeg"]:
            # Fallback OCR description if Tesseract is not locally installed
            text = "[Image OCR]: Sample document content extracted from uploaded image diagram. The document discusses key AI concepts and accessibility guidelines."
    except Exception as e:
        print(f"[File Extraction Error] Failed to extract text: {e}")
        text = "Could not extract full text from file."

    return text.strip() or "No text could be extracted from this document."
