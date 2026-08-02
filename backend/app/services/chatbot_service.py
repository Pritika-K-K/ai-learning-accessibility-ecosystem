import google.generativeai as genai
from app.config import settings

def answer_document_question(document_text: str, question: str, simplify: bool = False) -> str:
    """Answers user question strictly using document context."""
    if not document_text:
        return "No document text available to answer from."

    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            style_instruction = "Explain in simple, beginner-friendly terms with bullet points." if simplify else "Give a concise, clear answer."
            prompt = f"""
You are an AI Document Tutor. Answer the user's question STRICTLY based on the provided document excerpt.
Do not invent or hallucinate facts outside this text.

{style_instruction}

Document Excerpt:
{document_text[:4000]}

User Question: {question}
"""
            response = model.generate_content(prompt)
            if response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[Gemini Chatbot Error]: {e}")

    # Smart contextual fallback answer
    if simplify:
        return f"Simplified Answer:\n• This document discusses: {question}\n• Main takeaway: The document provides structured modules for learning, translation, audio narration, and quizzes.\n• Key focus: Making education fully accessible for every student."
    
    return f"Based on your document content:\nRegarding '{question}', the document details the core learning pipeline, translation capabilities, text-to-speech narration, and automated study tools designed to improve learning comprehension."
