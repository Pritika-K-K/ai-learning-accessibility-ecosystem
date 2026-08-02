import os
import uuid
from gtts import gTTS
from app.config import settings

def generate_tts_audio(text: str, language_code: str = "en", slow: bool = False) -> dict:
    """Generates audio file using gTTS and creates captions."""
    if not text:
        text = "No content available for narration."

    filename = f"audio_{uuid.uuid4().hex[:8]}.mp3"
    audio_path = os.path.join(settings.AUDIO_DIR, filename)

    try:
        # Generate MP3 file
        tts = gTTS(text=text[:1500], lang=language_code if len(language_code) == 2 else "en", slow=slow)
        tts.save(audio_path)
    except Exception as e:
        print(f"[gTTS Warning] Audio generation fallback: {e}")
        # Create blank/dummy MP3 file if gTTS network fails
        with open(audio_path, "wb") as f:
            f.write(b"ID3\x03\x00\x00\x00\x00\x00")

    # Generate VTT Captions
    caption_filename = f"captions_{uuid.uuid4().hex[:8]}.vtt"
    caption_path = os.path.join(settings.CAPTIONS_DIR, caption_filename)
    
    vtt_content = f"WEBVTT\n\n00:00.000 --> 00:05.000\n{text[:100]}\n\n00:05.000 --> 00:10.000\n{text[100:200]}"
    with open(caption_path, "w", encoding="utf-8") as f:
        f.write(vtt_content)

    return {
        "audio_url": f"/audio/{filename}",
        "caption_url": f"/captions/{caption_filename}",
        "audio_path": audio_path,
        "caption_path": caption_path
    }
