import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf():
    pdf_filename = "Learnix_Hackathon_Judge_Presentation_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=24, leading=28,
        textColor=colors.HexColor('#4F46E5'), alignment=0, spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=12, leading=16,
        textColor=colors.HexColor('#64748B'), spaceAfter=15
    )

    section_heading = ParagraphStyle(
        'SectionHeading', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=15, leading=18,
        textColor=colors.HexColor('#1E1B4B'), spaceBefore=14, spaceAfter=8
    )

    sub_section_heading = ParagraphStyle(
        'SubSectionHeading', parent=styles['Heading3'],
        fontName='Helvetica-Bold', fontSize=11, leading=14,
        textColor=colors.HexColor('#334155'), spaceBefore=8, spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9.5, leading=13.5,
        textColor=colors.HexColor('#334155'), spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9, leading=13,
        textColor=colors.HexColor('#1E293B'), leftIndent=12, spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=9, leading=11,
        textColor=colors.white, alignment=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, leading=11.5,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # -------------------------------------------------------------
    # PAGE 1: TITLE & PLATFORM OVERVIEW
    # -------------------------------------------------------------
    story.append(Paragraph("Learnix", title_style))
    story.append(Paragraph("<b>AI-Powered Inclusive Learning & Accessibility Ecosystem</b><br/>Hackathon Judge Presentation & Architecture Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceAfter=12))

    story.append(Paragraph("Executive Summary & Platform Mission", section_heading))
    story.append(Paragraph(
        "<b>Learnix</b> is an enterprise-grade, accessibility-first AI educational ecosystem designed to bridge learning barriers for students with visual, auditory, cognitive, and linguistic challenges. By combining multi-source document ingestion, optical character recognition (OCR), neural Machine Translation into scheduled Indian languages, multi-language Text-to-Speech (TTS) narration, and Retrieval-Augmented Generation (RAG) AI Tutoring, Learnix provides a unified platform where every student can learn in their preferred style and language.",
        body_style
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Key Impact Highlights & Standards Alignment", sub_section_heading))
    story.append(Paragraph("• <b>W3C WCAG 2.1 AAA Compliant</b>: Features OpenDyslexic typography, high contrast modes, focus rulers, and automated caption generation.", bullet_style))
    story.append(Paragraph("• <b>NEP 2020 Aligned</b>: Fulfills National Education Policy Clause 4.11 for mother-tongue instruction & Section 23 for NETF educational technology.", bullet_style))
    story.append(Paragraph("• <b>Digital India Bhashini Vision</b>: Breaks regional language barriers across 9 scheduled Indian languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, English).", bullet_style))

    story.append(Spacer(1, 12))
    story.append(Paragraph("Complete Technology Stack & Libraries Used", section_heading))

    tech_data = [
        [
            Paragraph("<b>Layer</b>", table_header_style),
            Paragraph("<b>Technologies & Libraries Used</b>", table_header_style),
            Paragraph("<b>Core Function & Purpose</b>", table_header_style)
        ],
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_style),
            Paragraph("React 18, Vite 5, Tailwind CSS, Lucide React, Recharts, React Router v6", table_cell_style),
            Paragraph("Single Page Application (SPA), accessible glassmorphism UI, interactive charts, dyslexia font toggles.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend API Engine</b>", table_cell_style),
            Paragraph("Python 3.11, FastAPI, Uvicorn ASGI, Pydantic, SQLAlchemy ORM", table_cell_style),
            Paragraph("High-performance asynchronous REST API backend routing, data validation, and database ORM abstraction.", table_cell_style)
        ],
        [
            Paragraph("<b>AI / LLM Services</b>", table_cell_style),
            Paragraph("Google Gemini API (gemini-3.5-flash / gemini-2.0-flash / gemini-pro)", table_cell_style),
            Paragraph("Document Q&A RAG tutoring, intelligent content summarization, dynamic quiz generation, and accessibility audits.", table_cell_style)
        ],
        [
            Paragraph("<b>Translation & Speech</b>", table_cell_style),
            Paragraph("deep-translator (Google Translate API engine), gTTS (Google Text-to-Speech)", table_cell_style),
            Paragraph("Neural text translation across 9 Indian languages & native script MP3 audio narration + WebVTT captions.", table_cell_style)
        ],
        [
            Paragraph("<b>OCR & Document Ingestion</b>", table_cell_style),
            Paragraph("PyMuPDF (fitz), pytesseract (Tesseract OCR), python-docx, python-pptx, Pillow (PIL), BeautifulSoup4, youtube-transcript-api", table_cell_style),
            Paragraph("Text extraction from PDFs, DOCX, PPTX, image OCR processing, web scraping, and YouTube caption extraction.", table_cell_style)
        ],
        [
            Paragraph("<b>Database & Security</b>", table_cell_style),
            Paragraph("PostgreSQL 15 (Production), SQLite (Fallback), Passlib (bcrypt), python-jose (JWT)", table_cell_style),
            Paragraph("Relational database storage, encrypted password hashing, JWT bearer token authorization, and user data privacy isolation.", table_cell_style)
        ]
    ]

    t_tech = Table(tech_data, colWidths=[1.3*inch, 2.7*inch, 3.2*inch])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # PAGE 2: COMPLETE MODULE BREAKDOWN (PART 1)
    # -------------------------------------------------------------
    story.append(Paragraph("Detailed Ecosystem Modules & Architecture", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=10))

    modules_part1 = [
        ("Module 1: Upload & Multi-Source Ingestion Center", [
            "• <b>Supported Input Sources</b>: PDF documents, Word (DOCX), PowerPoint (PPTX), Images (PNG, JPG), Web URLs, and YouTube Video URLs.",
            "• <b>Multi-Engine Processing</b>: PyMuPDF parses digital PDFs; Tesseract OCR extracts text from scanned documents/slides; BeautifulSoup4 scrapes web articles; youtube-transcript-api fetches closed-captions.",
            "• <b>Automated Subject Tagging</b>: Auto-classifies uploads into subjects (AI, Science, Mathematics, Literature, History) with initial readability metrics."
        ]),
        ("Module 2: Multilingual Translation Center", [
            "• <b>9 Indic Languages Supported</b>: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, and English.",
            "• <b>Neural Machine Translation</b>: Powered by Google Gemini API & deep-translator for domain-specific terminology preservation.",
            "• <b>Version Control</b>: Stores multiple translation iterations per document in the database, allowing instant switching between versions."
        ]),
        ("Module 3: Accessibility Suite & Multi-Language TTS", [
            "• <b>Multi-Language Audio Narration</b>: Converts translated text into native-script MP3 audio using gTTS with speed control (0.75x to 1.5x) and voice gender options.",
            "• <b>WebVTT Closed Captions</b>: Automatically generates synchronized subtitle files (.vtt) for screen reader accessibility.",
            "• <b>W3C Reading Modes</b>: OpenDyslexic font spacing, High Contrast pure-black mode, Reading Ruler focus guide, and responsive text sizing.",
            "• <b>Accessibility Compliance Suite</b>: Format-specific automated WCAG audits:"
            "<br/>&nbsp;&nbsp;&nbsp;&nbsp;- <b>YouTube Videos</b>: Caption Availability Check + Spoken Language Check."
            "<br/>&nbsp;&nbsp;&nbsp;&nbsp;- <b>Images & Slides</b>: Color Contrast Analysis (Low contrast & unreadable combinations detection with WCAG recommendations) + OCR Check."
            "<br/>&nbsp;&nbsp;&nbsp;&nbsp;- <b>PDF Documents</b>: OCR Selectability, Heading Structure Analysis (H1 missing, skipped levels), Language Detection, Font Accessibility."
            "<br/>&nbsp;&nbsp;&nbsp;&nbsp;- <b>Web URLs</b>: Web text selectability, HTML heading structure, language detection, and typography."
        ]),
        ("Module 4: Smart Quiz & Revision Generator", [
            "• <b>Content-Driven Generation</b>: Parses uploaded study content into 4 question formats: Multiple Choice (MCQs), True/False, Fill-in-the-Blanks, and Flashcards.",
            "• <b>Multi-Language Quiz Translation</b>: Generates quiz questions directly in the user's chosen target language (e.g. Tamil or Hindi).",
            "• <b>Interactive Assessment</b>: Live score calculation, instant feedback, explanation popups, and progress recording."
        ])
    ]

    for title_mod, points in modules_part1:
        story.append(Paragraph(title_mod, sub_section_heading))
        for pt in points:
            story.append(Paragraph(pt, bullet_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # PAGE 3: COMPLETE MODULE BREAKDOWN (PART 2) & JUDGING SUMMARY
    # -------------------------------------------------------------
    story.append(Paragraph("Detailed Ecosystem Modules (Continued)", section_heading))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=10))

    modules_part2 = [
        ("Module 5: AI Study Assistant (Document Chat / RAG)", [
            "• <b>Gemini RAG Architecture</b>: Queries document context using Gemini API (gemini-3.5-flash) with Extractive QA semantic search fallback.",
            "• <b>'Explain Simply' Mode</b>: Simplifies complex technical terms into beginner-friendly bullet points for neurodivergent learners.",
            "• <b>On-the-Spot Answer Translation</b>: Translates answers into 9 Indian languages dynamically."
        ]),
        ("Module 6: Learning Library & Resource Manager", [
            "• <b>Centralized Vault</b>: Organizes all uploaded documents, generated audio narrations, translations, and quizzes.",
            "• <b>Search & Filtering</b>: Instant search by document title, subject, file format, or upload date."
        ]),
        ("Module 7: Analytics & Learning Progress Dashboard", [
            "• <b>Interactive Charts</b>: Powered by Recharts to display weekly learning progress, accessibility scores, and document completion metrics.",
            "• <b>Gamified Metrics</b>: Displays hours learned, audio listened, and quizzes completed."
        ]),
        ("Module 8: Admin Control Panel & Diagnostics", [
            "• <b>System Diagnostics</b>: Monitors REST API health, CPU/RAM usage, database connection status, storage space, and active sessions."
        ]),
        ("Module 9: Authentication, Profile & Data Privacy", [
            "• <b>Secure Database Auth</b>: User account signup and login using bcrypt hashed passwords stored in PostgreSQL/SQLite.",
            "• <b>User Data Privacy Isolation</b>: Enforces strict user_id database filtering so each user's history and documents are visible ONLY to them.",
            "• <b>Session Logout</b>: Full JWT token cleanup and protected route navigation gates."
        ])
    ]

    for title_mod, points in modules_part2:
        story.append(Paragraph(title_mod, sub_section_heading))
        for pt in points:
            story.append(Paragraph(pt, bullet_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))
    story.append(Paragraph("Hackathon Judging Criteria Alignment Summary", section_heading))

    judge_data = [
        [
            Paragraph("<b>Judging Criteria</b>", table_header_style),
            Paragraph("<b>How Learnix Excels & Demonstrates Excellence</b>", table_header_style)
        ],
        [
            Paragraph("<b>Innovation & Technical Complexity</b>", table_cell_style),
            Paragraph("Integrates 5 AI/NLP engines (LLM RAG, Neural MT, gTTS, OCR, Web/YouTube scraping) into a seamless, reactive full-stack web application.", table_cell_style)
        ],
        [
            Paragraph("<b>Social Impact & Inclusion</b>", table_cell_style),
            Paragraph("Empowers neurodivergent students (dyslexia, ADHD), visually/auditory impaired learners, and regional language students across India.", table_cell_style)
        ],
        [
            Paragraph("<b>Execution & UI/UX Design</b>", table_cell_style),
            Paragraph("Stunning modern glassmorphism design, high contrast toggles, OpenDyslexic font support, responsive layout, 0% latency UI transitions.", table_cell_style)
        ],
        [
            Paragraph("<b>Completeness & Real-World Utility</b>", table_cell_style),
            Paragraph("Fully functional end-to-end platform with database persistence, JWT authentication, fallback mechanisms, and zero mock place-holders.", table_cell_style)
        ]
    ]

    t_judge = Table(judge_data, colWidths=[2.2*inch, 5.0*inch])
    t_judge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E1B4B')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_judge)

    doc.build(story)
    print(f"PDF successfully generated: {os.path.abspath(pdf_filename)}")

if __name__ == '__main__':
    generate_pdf()
