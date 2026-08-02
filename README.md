# AI-Powered Learning Accessibility Ecosystem

A full-stack, AI-driven learning platform that translates, simplifies, narrates, and quizzes students on their study materials — designed with accessibility as a top priority.

---

## 🏗️ Project Architecture

- **Frontend**: React 18 SPA (Vite, Tailwind CSS, Lucide Icons, Recharts, Google OAuth)
- **Backend**: FastAPI (Python 3.10+) with SQLAlchemy ORM, JWT authentication, PyMuPDF, gTTS, Gemini AI
- **Database**: PostgreSQL (with automatic SQLite fallback for immediate out-of-the-box local testing)

---

## 📁 Workspace Recommendation

It is recommended to set this directory as your active workspace in VS Code:
`C:\Users\Admin\.gemini\antigravity-ide\scratch\ai-learning-accessibility-ecosystem`

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites Installation

Make sure you have installed on your computer:
- **Python 3.10+** (Verify with `python --version`)
- **Node.js 18+** & npm (Verify with `node -v`)
- **PostgreSQL** (Optional; if PostgreSQL is not running yet, the backend automatically uses `learning_accessibility.db` SQLite fallback so you can test immediately).

---

### 2. Backend Setup & Virtual Environment (VS Code)

#### **Step 2.1: Open Terminal in VS Code**
Open VS Code, navigate to `Terminal -> New Terminal`, and change directory into `backend`:
```powershell
cd backend
```

#### **Step 2.2: Create Python Virtual Environment (`venv`)**
Run the following command to create a virtual environment named `venv`:
```powershell
python -m venv venv
```

#### **Step 2.3: Activate the Virtual Environment in VS Code**
- **On Windows PowerShell**:
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **Select Python Interpreter in VS Code**:
  1. Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac).
  2. Search for `Python: Select Interpreter`.
  3. Select `./backend/venv/Scripts/python.exe`.

#### **Step 2.4: Install `requirements.txt` Packages**
With the virtual environment activated `(venv)`, install all dependencies:
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 3. Configuring API Keys & `.env` Files

#### **Backend `.env` Setup**
In `backend/`, copy `.env.example` to `.env` or create `.env`:
```ini
# Database Settings (PostgreSQL Connection String)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learning_accessibility_db

# Security Key for JWT Tokens
SECRET_KEY=my_super_secret_jwt_key_2026

# Google OAuth Credentials (Provided by User)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Models (Optional - Gemini API Key)
GEMINI_API_KEY=your_gemini_api_key
```

#### **Frontend `.env` Setup**
In `frontend/`, copy `.env.example` to `.env` or create `.env`:
```ini
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

### 4. Installing Frontend Dependencies

Open a second terminal window in VS Code and run:
```powershell
cd frontend
npm install
```

---

### 5. Starting & Restarting the Project in VS Code

#### **Start FastAPI Backend**:
In terminal 1 (`backend/` with `venv` activated):
```powershell
uvicorn app.main:app --reload --port 8000
```
- API Server: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

#### **Start React Frontend**:
In terminal 2 (`frontend/`):
```powershell
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 🌟 Key Features Implemented

1. **Header Navbar on Every Page**: Links to Dashboard, Upload Center, Translation, Accessibility, Quizzes, AI Chat, Library, Analytics, Admin Panel, Profile.
2. **Footer on Every Page**: Contact information (Email: `support@ailearningecosystem.edu`, Phone: `+1 (800) 555-ACCESSIBLE`, Address: `100 Innovation Parkway`), social links, and security compliance.
3. **Module 1: Authentication**: Email & Password login/registration + Google OAuth Sign-in integration.
4. **Module 2: Dashboard**: Welcome card, quick actions, pipeline status per file, analytics cards, learning trend charts.
5. **Module 3: Upload Center**: PDF, DOCX, PPTX, TXT, Images (OCR), raw text paste, URL & YouTube transcript ingestion.
6. **Module 4: AI Processing Engine**: Text extraction, language detection, summary & simplification pipeline.
7. **Module 5: Translation Center**: Side-by-side view, Indian language support (Tamil, Telugu, Hindi, Kannada, Malayalam, Marathi, Gujarati, Bengali, English) + **Embedded AI Document Tutor** RAG Q&A.
8. **Module 6: Accessibility Center**: Text-to-Speech narration (voice speed & gender settings), inline caption track editor, Dyslexia-friendly font (OpenDyslexic), High contrast mode, Reading guide ruler, Accessibility score calculator.
9. **Module 7: AI Study Assistant (Document Chat)**: Natural language Q&A over document context with "Explain Simply" mode and on-the-spot translation.
10. **Module 8: Smart Quiz Generator**: MCQ, Fill-in-blanks, True/False, Flashcards with Easy/Medium/Hard difficulty levels, interactive quiz player, and instant scoring with explanations.
11. **Module 9: Learning Library**: Google Drive style file grid/list view with subject folders, search, filters, favorites, and trash.
12. **Module 10: Analytics**: Learning hours charts, document stats, language distribution.
13. **Module 11: Admin Panel**: Moderation table, active user list, storage usage meters, system health logs.
