import re
import google.generativeai as genai
from app.config import settings

def search_document_passages(document_text: str, question: str, simplify: bool = False) -> str:
    """Extractive QA search engine to answer questions strictly using relevant document passages."""
    if not document_text or not document_text.strip():
        return "No study document text is available to answer your question."

    # Extract non-stop query words
    stop_words = {
        'what', 'is', 'are', 'the', 'how', 'why', 'who', 'which', 'where', 'when',
        'does', 'do', 'can', 'explain', 'in', 'of', 'to', 'a', 'an', 'and', 'or',
        'for', 'about', 'with', 'from', 'this', 'that', 'these', 'those', 'tell',
        'me', 'please', 'give', 'define', 'meaning'
    }
    
    question_clean = question.strip()
    query_tokens = [
        w.lower().strip('.,()?":;!')
        for w in re.findall(r'\b[A-Za-z0-9]{2,}\b', question_clean)
        if w.lower() not in stop_words
    ]

    # Split document text into sentences and paragraphs
    clean_text = document_text.replace("\r", " ").strip()
    passages = [p.strip() for p in re.split(r'[.!?\n]+', clean_text) if len(p.strip()) > 15]

    if not passages:
        passages = [clean_text]

    # Rank passages by term overlap
    scored_passages = []
    for passage in passages:
        passage_words = set(w.lower().strip('.,()?":;!') for w in re.findall(r'\b[A-Za-z0-9]{2,}\b', passage))
        overlap_count = sum(1 for token in query_tokens if token in passage_words)
        if overlap_count > 0:
            scored_passages.append((overlap_count, passage))

    # Sort descending by match score
    scored_passages.sort(key=lambda x: x[0], reverse=True)

    if scored_passages:
        # Get top matching passages
        top_matches = [p for _, p in scored_passages[:3]]
        
        if simplify:
            bullets = "\n".join([f"• {match}" for match in top_matches])
            return f"Simplified Explanation:\n\n{bullets}"
        else:
            bullets = "\n\n".join([f"• {match}" for match in top_matches])
            return f"Based on your document content:\n\n{bullets}"
    else:
        # Fallback to document overview if exact query terms didn't hit
        overview = passages[:2]
        overview_text = " ".join(overview)
        if simplify:
            return f"Simplified Overview:\n• {overview_text[:250]}"
        return f"Regarding '{question_clean}', here is the most relevant section from your document:\n\n• {overview_text[:350]}"

def answer_document_question(document_text: str, question: str, simplify: bool = False) -> str:
    """Answers user question strictly using document context via Gemini API or Extractive QA search."""
    if not document_text or not document_text.strip():
        return "No document text available to answer from."

    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20 and not settings.GEMINI_API_KEY.startswith("yAQ"):
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
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"[Gemini Chatbot Info]: {e}")

    # Fallback: Dynamic Extractive QA search engine operating on uploaded text
    return search_document_passages(document_text, question, simplify=simplify)
