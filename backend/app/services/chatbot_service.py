import re
import google.generativeai as genai
from app.config import settings

def clean_gemini_api_key() -> str:
    """Retrieves and cleans GEMINI_API_KEY by stripping leading typo prefix if present."""
    key = settings.GEMINI_API_KEY or ""
    key = key.strip()
    if key.startswith("yAQ"):
        key = key[1:]  # remove leading 'y' typo
    return key

def search_document_passages(document_text: str, question: str, simplify: bool = False) -> str:
    """Extractive QA search engine to answer questions accurately using relevant document passages."""
    if not document_text or not document_text.strip():
        return "No study document content is currently available to answer your question."

    stop_words = {
        'what', 'is', 'are', 'the', 'how', 'why', 'who', 'which', 'where', 'when',
        'does', 'do', 'can', 'explain', 'in', 'of', 'to', 'a', 'an', 'and', 'or',
        'for', 'about', 'with', 'from', 'this', 'that', 'these', 'those', 'tell',
        'me', 'please', 'give', 'define', 'meaning', 'describe'
    }
    
    question_clean = question.strip()
    query_tokens = [
        w.lower().strip('.,()?":;!')
        for w in re.findall(r'\b[A-Za-z0-9]{2,}\b', question_clean)
        if w.lower() not in stop_words
    ]

    clean_text = document_text.replace("\r", " ").strip()
    passages = [p.strip() for p in re.split(r'[.!?\n]+', clean_text) if len(p.strip()) > 15]

    if not passages:
        passages = [clean_text]

    scored_passages = []
    for passage in passages:
        passage_words = set(w.lower().strip('.,()?":;!') for w in re.findall(r'\b[A-Za-z0-9]{2,}\b', passage))
        overlap_count = sum(1 for token in query_tokens if token in passage_words)
        if overlap_count > 0:
            scored_passages.append((overlap_count, passage))

    scored_passages.sort(key=lambda x: x[0], reverse=True)

    if scored_passages:
        top_matches = [p for _, p in scored_passages[:3]]
        bullets = "\n\n".join([f"• {match}." for match in top_matches])
        if simplify:
            return f"Simplified Explanation on '{question_clean}':\n\n{bullets}"
        return f"Based on your document content regarding '{question_clean}':\n\n{bullets}"
    else:
        overview = passages[:3]
        overview_bullets = "\n\n".join([f"• {p}." for p in overview])
        return f"Here is the key information from your document regarding '{question_clean}':\n\n{overview_bullets}"

def answer_document_question(document_text: str, question: str, simplify: bool = False) -> str:
    """
    Answers user questions accurately and thoroughly using Gemini API (or Extractive QA fallback).
    """
    if not question or not question.strip():
        return "Please enter a question about your study material."

    doc_context = document_text.strip() if document_text else ""
    if not doc_context:
        doc_context = "No document uploaded yet."

    api_key = clean_gemini_api_key()

    # Try Gemini API if API key is present
    if api_key and len(api_key) > 15:
        genai.configure(api_key=api_key)
        
        style_prompt = (
            "Explain in simple, beginner-friendly terms with bullet points and short sentences."
            if simplify else
            "Provide a comprehensive, accurate, and structured answer with bullet points."
        )

        prompt = f"""
You are Learnix AI Study Tutor, an expert, accessible AI educational assistant.
Answer the user's question accurately, clearly, and thoroughly based on the provided document content.

Instructions:
1. Focus directly on answering the user's specific question: "{question}"
2. Use the provided document text as the primary source of truth.
3. {style_prompt}
4. Maintain high educational clarity and structured formatting.

Document Content:
{doc_context[:5000]}

User Question: {question}
"""

        # Try active Gemini model list in sequence
        candidate_models = ['gemini-3.5-flash', 'gemini-3.0-flash', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-pro-latest']
        for model_name in candidate_models:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                if response and response.text and len(response.text.strip()) > 10:
                    return response.text.strip()
            except Exception as e:
                print(f"[Gemini Model {model_name} Error]: {e}")

    # Fallback to intelligent Extractive QA search engine if Gemini API is unavailable
    return search_document_passages(doc_context, question, simplify=simplify)
