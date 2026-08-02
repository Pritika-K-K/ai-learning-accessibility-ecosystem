import os
import uuid
from gtts import gTTS
from app.config import settings
from app.services.translate_service import translate_text, LANGUAGE_MAP

def resolve_language_code(lang_input: str) -> tuple[str, str]:
    """Resolves language name (e.g. 'Tamil') or ISO code (e.g. 'ta') into (display_name, iso_code)."""
    if not lang_input:
        return ("English", "en")

    # Match exact or title-cased key in LANGUAGE_MAP
    title_lang = lang_input.strip().capitalize()
    if title_lang in LANGUAGE_MAP:
        return (title_lang, LANGUAGE_MAP[title_lang])

    # Search by ISO code value
    for name, code in LANGUAGE_MAP.items():
        if code.lower() == lang_input.strip().lower():
            return (name, code)

    # ISO code fallback
    if len(lang_input.strip()) == 2:
        return (lang_input.strip(), lang_input.strip().lower())

    return ("English", "en")

def generate_tts_audio(text: str, language_input: str = "English", slow: bool = False) -> dict:
    """Generates audio file using gTTS in user's target language and creates WebVTT captions."""
    if not text or not text.strip():
        text = "No content available for narration."

    lang_display, lang_code = resolve_language_code(language_input)

    # If target language is non-English, translate narration text if not already translated
    narrate_text = text.strip()
    if lang_code != "en":
        try:
            narrate_text = translate_text(narrate_text[:2000], lang_display)
        except Exception as e:
            print(f"[TTS Translation Warning] {e}")

    filename = f"audio_{uuid.uuid4().hex[:8]}.mp3"
    audio_path = os.path.join(settings.AUDIO_DIR, filename)

    try:
        # Generate MP3 file in target language native script
        tts = gTTS(text=narrate_text[:1500], lang=lang_code, slow=slow)
        tts.save(audio_path)
    except Exception as e:
        print(f"[gTTS Error] Failed to generate audio for language '{lang_display}' ({lang_code}): {e}")
        # Fallback to English gTTS if specific language gTTS fails
        try:
            tts = gTTS(text=text[:1500], lang="en", slow=slow)
            tts.save(audio_path)
        except Exception:
            # Blank MP3 fallback
            with open(audio_path, "wb") as f:
                f.write(b"ID3\x03\x00\x00\x00\x00\x00")

    # Generate VTT Captions
    caption_filename = f"captions_{uuid.uuid4().hex[:8]}.vtt"
    caption_path = os.path.join(settings.CAPTIONS_DIR, caption_filename)
    
    vtt_content = f"WEBVTT\n\n00:00.000 --> 00:05.000\n{narrate_text[:100]}\n\n00:05.000 --> 00:10.000\n{narrate_text[100:200]}"
    with open(caption_path, "w", encoding="utf-8") as f:
        f.write(vtt_content)

    return {
        "audio_url": f"/audio/{filename}",
        "caption_url": f"/captions/{caption_filename}",
        "audio_path": audio_path,
        "caption_path": caption_path,
        "translated_text": narrate_text,
        "language": lang_display,
        "language_code": lang_code
    }
