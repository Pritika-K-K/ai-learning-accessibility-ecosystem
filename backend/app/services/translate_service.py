import google.generativeai as genai
from deep_translator import GoogleTranslator
from app.config import settings

LANGUAGE_MAP = {
    "Hindi": "hi",
    "Tamil": "ta",
    "Telugu": "te",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Marathi": "mr",
    "Gujarati": "gu",
    "Bengali": "bn",
    "English": "en"
}

def clean_gemini_api_key() -> str:
    key = settings.GEMINI_API_KEY or ""
    key = key.strip()
    if key.startswith("yAQ"):
        key = key[1:]
    return key

def translate_text(text: str, target_language: str) -> str:
    """Translates text into the target language using Gemini API or Google Translator."""
    if not text or target_language.lower() == "english":
        return text

    api_key = clean_gemini_api_key()
    if api_key and len(api_key) > 15:
        try:
            genai.configure(api_key=api_key)
            for model_name in ['gemini-3.5-flash', 'gemini-3.0-flash', 'gemini-2.0-flash', 'gemini-flash-latest']:
                try:
                    model = genai.GenerativeModel(model_name)
                    prompt = f"Translate the following educational content accurately into {target_language}. Maintain key terminology and educational clarity:\n\n{text[:3000]}"
                    response = model.generate_content(prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue
        except Exception as e:
            print(f"[Gemini Translation Info]: {e}")

    # Fallback to deep-translator
    try:
        lang_code = LANGUAGE_MAP.get(target_language, "hi")
        translator = GoogleTranslator(source="auto", target=lang_code)
        translated = translator.translate(text[:2500])
        if translated:
            return translated
    except Exception as e:
        print(f"[Deep Translator Info]: {e}")

    return text
