from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class GoogleAuthRequest(BaseModel):
    id_token: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    preferred_language: str = "English"
    dyslexic_font: bool = False
    high_contrast: bool = False
    font_size: str = "medium"

    class Config:
        from_attributes = True

class PreferencesUpdate(BaseModel):
    preferred_language: Optional[str] = None
    font_size: Optional[str] = None
    dyslexic_font: Optional[bool] = None
    high_contrast: Optional[bool] = None
    theme: Optional[str] = None

# --- Document Schemas ---
class DocumentCreate(BaseModel):
    title: str
    file_type: str
    original_text: Optional[str] = None
    subject: Optional[str] = "General"

class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    file_type: str
    file_size: int
    original_text: Optional[str]
    summary_text: Optional[str]
    simplified_text: Optional[str]
    status: str
    subject: str
    is_favorite: bool
    accessibility_score: int
    created_at: datetime

    class Config:
        from_attributes = True

class TextUploadRequest(BaseModel):
    title: str
    text: str
    subject: Optional[str] = "General"

class UrlUploadRequest(BaseModel):
    url: str
    title: Optional[str] = None
    subject: Optional[str] = "General"

# --- Translation Schemas ---
class TranslateRequest(BaseModel):
    document_id: int
    target_language: str  # Tamil, Telugu, Hindi, Malayalam, Kannada, Marathi, Gujarati, Bengali, English
    text_override: Optional[str] = None

class TranslationResponse(BaseModel):
    id: int
    document_id: int
    target_language: str
    translated_text: str
    version: int

    class Config:
        from_attributes = True

# --- AI Chat / Tutor Schemas ---
class ChatRequest(BaseModel):
    document_id: int
    question: str
    target_language: Optional[str] = "English"
    simplify: Optional[bool] = False

class ChatResponse(BaseModel):
    id: int
    question: str
    answer: str
    target_language: str
    translated_answer: Optional[str] = None

# --- Quiz Schemas ---
class QuizGenerateRequest(BaseModel):
    document_id: int
    difficulty: Optional[str] = "Medium"  # Easy, Medium, Hard
    question_count: Optional[int] = 5
    target_language: Optional[str] = "English"

class QuizResponse(BaseModel):
    id: int
    document_id: int
    title: str
    difficulty: str
    questions: List[dict]

# --- Accessibility / TTS Schemas ---
class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "English"
    gender: Optional[str] = "Female"
    speed: Optional[float] = 1.0

class AccessibilityReportResponse(BaseModel):
    document_id: int
    score: int
    suggestions: List[str]
    reading_time_minutes: float
