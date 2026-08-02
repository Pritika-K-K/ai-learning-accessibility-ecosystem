import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Learnix"

    API_V1_STR: str = "/api"
    SECRET_KEY: str = "super-secret-key-change-in-production-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database Configuration (PostgreSQL with SQLite fallback)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/learning_accessibility_db"
    )

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # AI / LLM Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Storage Paths
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    AUDIO_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")
    CAPTIONS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "captions")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.AUDIO_DIR, exist_ok=True)
os.makedirs(settings.CAPTIONS_DIR, exist_ok=True)
