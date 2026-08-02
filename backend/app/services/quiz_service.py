import json
import google.generativeai as genai
from app.config import settings

def generate_quiz_questions(text: str, difficulty: str = "Medium", question_count: int = 5) -> list:
    """Generates structured quiz questions using Gemini API or built-in generator."""
    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
Create a {difficulty} level quiz with {question_count} questions based on this study text.
Return ONLY valid JSON array with objects in this format:
[
  {{
    "id": 1,
    "type": "mcq",
    "question": "Question string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Brief explanation"
  }}
]

Study text:
{text[:3000]}
"""
            response = model.generate_content(prompt)
            cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"[Gemini Quiz Generation Error]: {e}")

    # Fallback default quiz questions
    return [
        {
            "id": 1,
            "type": "mcq",
            "question": f"What is the primary theme of this study material?",
            "options": ["Accessibility and AI Learning", "Basic Data Entry", "Hardware Engineering", "Network Security"],
            "correct_answer": "Accessibility and AI Learning",
            "explanation": "The document highlights AI-assisted accessibility, translation, narration, and learning tools."
        },
        {
            "id": 2,
            "type": "true_false",
            "question": "The system supports translation into multiple Indian languages including Tamil, Telugu, and Hindi.",
            "options": ["True", "False"],
            "correct_answer": "True",
            "explanation": "Yes, Module 5 specifically provides translation across major Indian languages."
        },
        {
            "id": 3,
            "type": "fill_in_blank",
            "question": "The AI Document Tutor works by indexing documents using retrieval-augmented _________ (RAG).",
            "options": ["generation", "graphics", "games", "grouping"],
            "correct_answer": "generation",
            "explanation": "RAG stands for Retrieval-Augmented Generation."
        },
        {
            "id": 4,
            "type": "flashcard",
            "question": "Define Text-to-Speech (TTS) Narration.",
            "options": ["Converts written text to spoken audio", "Converts video to text", "Compresses image files", "Translates code to bytecode"],
            "correct_answer": "Converts written text to spoken audio",
            "explanation": "TTS generates clear audio narration for accessible learning."
        },
        {
            "id": 5,
            "type": "short_answer",
            "question": "How does accessibility mode support dyslexic learners?",
            "options": ["By providing OpenDyslexic font and high-contrast color themes", "By deleting long paragraphs", "By turning off images", "By restricting time limits"],
            "correct_answer": "By providing OpenDyslexic font and high-contrast color themes",
            "explanation": "Module 6 includes Dyslexia-friendly fonts, high-contrast modes, and reading guide overlays."
        }
    ]
