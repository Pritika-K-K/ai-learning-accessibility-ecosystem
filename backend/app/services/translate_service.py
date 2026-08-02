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

def translate_text(text: str, target_language: str) -> str:
    """Translates text into the target language using Gemini API or Google Translator."""
    if not text or target_language.lower() == "english":
        return text

    # Option 1: Try Gemini API if valid key is configured
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20 and not settings.GEMINI_API_KEY.startswith("yAQ"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"Translate the following educational content accurately into {target_language}. Maintain key terminology and educational clarity:\n\n{text[:3000]}"
            response = model.generate_content(prompt)
            if response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[Gemini Translation Info]: {e}")

    # Option 2: Live Google Translation via deep-translator
    try:
        lang_code = LANGUAGE_MAP.get(target_language, "hi")
        translator = GoogleTranslator(source="auto", target=lang_code)
        translated = translator.translate(text[:2500])
        if translated:
            return translated
    except Exception as e:
        print(f"[DeepTranslator Info]: {e}")

    # Option 3: Fallback translation formatting
    return f"[{target_language} Translation]: {text}"
