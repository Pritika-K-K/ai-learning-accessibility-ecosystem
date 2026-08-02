import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Trophy, ArrowRight, RotateCcw, Brain, Zap } from 'lucide-react';

const QuizGenerator = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
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
        question_count: questionCount
      });
      setQuiz(res.data);
    } catch (err) {
      alert('Quiz generation failed.');
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
          <span>Module 8: Smart Quiz & Assessment Generator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Smart Quiz Generator</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Test your comprehension with auto-generated assessments (MCQ, Fill in blanks, True/False, Flashcards).
        </p>
      </div>

      {/* Quiz Config Panel */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Easy">Easy (Fundamental concepts)</option>
              <option value="Medium">Medium (Balanced testing)</option>
              <option value="Hard">Hard (Deep technical analysis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={loading || !selectedDocId}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
        >
          {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          <span>{loading ? 'AI is generating questions...' : 'Generate Smart Quiz'}</span>
        </button>
      </div>

      {/* Active Quiz Card */}
      {quiz && !showResults && (
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">{quiz.difficulty} Level Quiz</span>
              <h3 className="text-sm font-semibold text-white">{quiz.title}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
              Question {currentIdx + 1} of {quiz.questions.length}
            </span>
          </div>

          {/* Current Question */}
          {quiz.questions[currentIdx] && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-white leading-relaxed">
                {quiz.questions[currentIdx].question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {quiz.questions[currentIdx].options.map((opt, idx) => {
                  const isSelected = userAnswers[quiz.questions[currentIdx].id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(quiz.questions[currentIdx].id, opt)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 text-xs font-bold"
            >
              Previous
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleCalculateScore}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Submit Quiz & View Score
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Score & Results Summary */}
      {showResults && (
        <div className="glass-panel rounded-3xl p-8 border border-emerald-500/40 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Quiz Completed!</h3>
            <p className="text-xs text-slate-300 mt-1">You scored {score} out of {quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)</p>
          </div>

          {/* Question Breakdown with Explanations */}
          <div className="text-left space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Answer Explanations:</h4>
            {quiz.questions.map((q, i) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correct_answer;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold text-white">{i + 1}. {q.question}</p>
                    {isCorrect ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-400 flex items-center space-x-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">Your Answer: <span className="font-semibold">{userAns || 'Not Answered'}</span></p>
                  <p className="text-[11px] text-emerald-400">Correct Answer: <span className="font-semibold">{q.correct_answer}</span></p>
                  <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded-lg">Explanation: {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizGenerator;
