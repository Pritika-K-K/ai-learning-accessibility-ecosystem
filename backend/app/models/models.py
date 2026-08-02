from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Null for Google OAuth users
    google_id = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="student")  # student, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    preferences = relationship("Preferences", back_populates="user", uselist=False)
    documents = relationship("Document", back_populates="user")
    chats = relationship("ChatHistory", back_populates="user")

class Preferences(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    preferred_language = Column(String, default="English")
    font_size = Column(String, default="medium")  # small, medium, large, x-large
    dyslexic_font = Column(Boolean, default=False)
    high_contrast = Column(Boolean, default=False)
    theme = Column(String, default="dark")  # dark, light, high-contrast
    auto_narrate = Column(Boolean, default=False)

    user = relationship("User", back_populates="preferences")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=False)  # pdf, docx, pptx, txt, image, url, youtube
    file_size = Column(Integer, default=0)
    original_text = Column(Text, nullable=True)
    summary_text = Column(Text, nullable=True)
    simplified_text = Column(Text, nullable=True)
    status = Column(String, default="Uploaded")  # Uploaded, Processing, Ready, Error
    subject = Column(String, default="General")
    is_favorite = Column(Boolean, default=False)
    is_trashed = Column(Boolean, default=False)
    accessibility_score = Column(Integer, default=85)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
    translations = relationship("Translation", back_populates="document", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="document", cascade="all, delete-orphan")
    audios = relationship("AudioCaption", back_populates="document", cascade="all, delete-orphan")

class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    target_language = Column(String, nullable=False)
    translated_text = Column(Text, nullable=False)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="translations")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    title = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")  # Easy, Medium, Hard
    questions_json = Column(Text, nullable=False)  # Store JSON of questions
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="quizzes")

class AudioCaption(Base):
    __tablename__ = "audio_captions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    audio_path = Column(String, nullable=False)
    caption_path = Column(String, nullable=True)
    language = Column(String, default="English")
    voice_gender = Column(String, default="Female")
    speed = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="audios")

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    target_language = Column(String, default="English")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chats")

class UserAnalytics(Base):
    __tablename__ = "user_analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    learning_hours = Column(Float, default=0.0)
    documents_uploaded = Column(Integer, default=0)
    quizzes_taken = Column(Integer, default=0)
    audio_listened_minutes = Column(Float, default=0.0)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)
