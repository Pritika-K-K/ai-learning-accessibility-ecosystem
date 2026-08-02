import json
import re
import random
import google.generativeai as genai
from app.config import settings
from app.services.translate_service import translate_text

def generate_local_document_quiz(text: str, difficulty: str = "Medium", question_count: int = 5) -> list:
    """Dynamically parses document text to generate content-specific quiz questions."""
    clean_text = text.replace("\r", " ").strip()
    sentences = [s.strip() for s in re.split(r'[.!?\n]+', clean_text) if len(s.strip()) > 25]

    if not sentences:
        sentences = [clean_text] if len(clean_text) > 10 else ["This document contains key educational concepts and study notes."]

    # Extract key vocabulary words (nouns & terms 4+ letters)
    all_words = list(set(re.findall(r'\b[A-Za-z]{4,}\b', clean_text)))
    if len(all_words) < 8:
        all_words += ["Concept", "Structure", "Process", "Analysis", "Framework", "Method", "Theory", "Application"]

    questions = []
    question_types = ["mcq", "true_false", "fill_in_blank", "flashcard", "short_answer"]

    for i in range(question_count):
        q_type = question_types[i % len(question_types)]
        sentence = sentences[i % len(sentences)]

        # Pick a target word from sentence for fill-in-the-blank or MCQ
        words_in_sent = [
            w for w in re.findall(r'\b[A-Za-z]{4,}\b', sentence)
            if w.lower() not in ["this", "that", "with", "from", "they", "their", "have", "been", "were", "which", "about", "other", "into", "also", "some"]
        ]
        target_word = random.choice(words_in_sent) if words_in_sent else "concept"

        # Generate options
        distractors = [w for w in all_words if w.lower() != target_word.lower()]
        random.shuffle(distractors)
        selected_distractors = distractors[:3]
        while len(selected_distractors) < 3:
            selected_distractors.append(f"Option {len(selected_distractors) + 1}")
        
        options = selected_distractors + [target_word]
        random.shuffle(options)

        if q_type == "mcq":
            masked_sentence = sentence.replace(target_word, "______")
            questions.append({
                "id": i + 1,
                "type": "mcq",
                "question": f"Which key term completes this concept: \"{masked_sentence}\"?",
                "options": options,
                "correct_answer": target_word,
                "explanation": f"According to your study material: \"{sentence}\"."
            })
        elif q_type == "true_false":
            formatted_sent = sentence[0].lower() + sentence[1:] if len(sentence) > 1 else sentence
            questions.append({
                "id": i + 1,
                "type": "true_false",
                "question": f"True or False: According to the document, {formatted_sent}.",
                "options": ["True", "False"],
                "correct_answer": "True",
                "explanation": f"Directly stated in your study document."
            })
        elif q_type == "fill_in_blank":
            masked_sentence = sentence.replace(target_word, "__________")
            questions.append({
                "id": i + 1,
                "type": "fill_in_blank",
                "question": f"Fill in the blank: \"{masked_sentence}\"",
                "options": options,
                "correct_answer": target_word,
                "explanation": f"The missing concept from the document is '{target_word}'."
            })
        elif q_type == "flashcard":
            questions.append({
                "id": i + 1,
                "type": "flashcard",
                "question": f"Key Concept Recall: What does the document state regarding '{target_word}'?",
                "options": [sentence, "Not mentioned in document", "Irrelevant concept", "Opposite meaning"],
                "correct_answer": sentence,
                "explanation": f"Excerpt from text: \"{sentence}\"."
            })
        else: # short_answer
            questions.append({
                "id": i + 1,
                "type": "short_answer",
                "question": f"Which statement best summarizes: \"{sentence[:100]}...\"?",
                "options": [sentence, "Concept is unrelated", "Definition is false", "None of the above"],
                "correct_answer": sentence,
                "explanation": f"Extracted from your uploaded document."
            })

    return questions

def translate_quiz_questions(questions: list, target_language: str) -> list:
    """Translates quiz questions, options, correct answers, and explanations into target language."""
    if not target_language or target_language.lower() == "english":
        return questions

    translated_questions = []
    for q in questions:
        q_copy = dict(q)
        try:
            q_copy["question"] = translate_text(q["question"], target_language)
            q_copy["explanation"] = translate_text(q["explanation"], target_language)

            new_options = []
            for opt in q.get("options", []):
                new_options.append(translate_text(str(opt), target_language))
            q_copy["options"] = new_options
            q_copy["correct_answer"] = translate_text(str(q["correct_answer"]), target_language)
        except Exception as e:
            print(f"[Quiz Translation Error]: {e}")

        translated_questions.append(q_copy)

    return translated_questions

def generate_quiz_questions(text: str, difficulty: str = "Medium", question_count: int = 5, target_language: str = "English") -> list:
    """Generates structured quiz questions in the user's chosen language using Gemini API or dynamic local document parser."""
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 20 and not settings.GEMINI_API_KEY.startswith("yAQ"):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
Create a {difficulty} level quiz in {target_language} with {question_count} questions based ONLY on this study text.
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
            print(f"[Gemini Quiz Generation Info]: {e}")

    # Fallback: Dynamic content-specific quiz generator derived strictly from uploaded text
    raw_questions = generate_local_document_quiz(text, difficulty, question_count)
    
    # Translate questions to user's selected language if non-English
    if target_language and target_language.lower() != "english":
        return translate_quiz_questions(raw_questions, target_language)
    
    return raw_questions
