import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Trophy, ArrowRight, RotateCcw, Brain, Zap, Languages } from 'lucide-react';

const QUIZ_LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'
];

const QuizGenerator = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active Quiz Execution State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
      if (res.data.length > 0) {
        setSelectedDocId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocId) return;
    setLoading(true);
    setQuiz(null);
    setShowResults(false);
    setUserAnswers({});
    setCurrentIdx(0);

    try {
      const res = await api.post('/quiz', {
        document_id: parseInt(selectedDocId),
        difficulty: difficulty,
        question_count: questionCount,
        target_language: selectedLanguage
      });
      setQuiz(res.data);
    } catch (err) {
      console.error(err);
      alert('Quiz generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, option) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleCalculateScore = () => {
    if (!quiz || !quiz.questions) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) {
        correct += 1;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Module 8: Multi-Language Smart Quiz & Assessment Generator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Smart Quiz Generator</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Test your comprehension with auto-generated assessments (MCQ, Fill in blanks, True/False, Flashcards) in your chosen language.
        </p>
      </div>

      {/* Quiz Config Panel */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Document</label>
            <select
              value={selectedDocId || ''}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Languages className="w-3 h-3 text-emerald-400" />
              <span>Quiz Language</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {QUIZ_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Easy">Easy (Fundamentals)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="Hard">Hard (Deep analysis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Questions Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
            </select>
          </div>

        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={loading || !selectedDocId}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? `Generating Quiz in ${selectedLanguage}...` : `Generate AI Quiz in ${selectedLanguage}`}</span>
        </button>
      </div>

      {/* Active Quiz Card */}
      {quiz && quiz.questions && quiz.questions.length > 0 && !showResults && (
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Question {currentIdx + 1} of {quiz.questions.length} ({selectedLanguage})
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase font-semibold">
              Type: {quiz.questions[currentIdx].type}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white leading-relaxed">
              {quiz.questions[currentIdx].question}
            </h3>

            <div className="space-y-2.5 pt-2">
              {quiz.questions[currentIdx].options.map((opt, idx) => {
                const isSelected = userAnswers[quiz.questions[currentIdx].id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(quiz.questions[currentIdx].id, opt)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="inline-block w-6 text-slate-400 font-mono">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCalculateScore}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Submit Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Results Summary */}
      {showResults && (
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 max-w-2xl mx-auto space-y-6 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Quiz Completed! ({selectedLanguage})</h2>
            <p className="text-xs text-slate-400">Here is your performance summary for this assessment.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 inline-block px-12">
            <span className="text-4xl font-black text-emerald-400">{score} / {quiz.questions.length}</span>
            <span className="block text-xs text-slate-400 mt-1">Total Score ({Math.round((score / quiz.questions.length) * 100)}%)</span>
          </div>

          {/* Detailed Explanations */}
          <div className="text-left space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Answer Review & Explanations:</h4>
            {quiz.questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correct_answer;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-white">Q{idx + 1}: {q.question}</span>
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-400 flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Your Answer: <span className="text-slate-200">{userAnswers[q.id] || 'Not answered'}</span></p>
                  <p className="text-xs text-emerald-400 font-mono">Correct Answer: <span>{q.correct_answer}</span></p>
                  <p className="text-xs text-slate-300 bg-slate-800/60 p-2 rounded-lg italic">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleGenerateQuiz()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz in {selectedLanguage}</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizGenerator;
