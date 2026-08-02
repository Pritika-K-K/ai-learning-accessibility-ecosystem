import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Languages, MessageSquare, Volume2, Download, Send, Sparkles, History, Bot } from 'lucide-react';

const INDIAN_LANGUAGES = [
  'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'English'
];

const TranslationCenter = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [targetLang, setTargetLang] = useState('Hindi');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  // Embedded AI Tutor Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Document Tutor. Ask me any question about your study material and I will explain it instantly!'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
      if (res.data.length > 0) {
        setSelectedDocId(res.data[0].id);
        setSelectedDoc(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleDocChange = (docId) => {
    const doc = documents.find((d) => d.id === parseInt(docId));
    setSelectedDocId(docId);
    setSelectedDoc(doc);
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
      const res = await api.post('/translate', {
        document_id: selectedDoc.id,
        target_language: targetLang
      });
      setTranslatedText(res.data.translated_text);
    } catch (err) {
      alert('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim() || !selectedDoc) return;

    const userMsg = chatQuestion;
    setChatQuestion('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await api.post('/chat', {
        document_id: selectedDoc.id,
        question: userMsg,
        target_language: targetLang,
        simplify: false
      });

      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
          translated_text: res.data.translated_answer
        }
      ]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'Sorry, I could not process your question.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Languages className="w-3.5 h-3.5" />
            <span>Module 5: Multilingual Translation Center & Embedded AI Tutor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Translation Center</h1>
        </div>

        {/* Document & Language Selectors */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedDocId || ''}
            onChange={(e) => handleDocChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-900 border border-indigo-500/40 text-indigo-300 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none"
          >
            {INDIAN_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <button
            onClick={handleTranslate}
            disabled={loading || !selectedDoc}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 shrink-0"
          >
            {loading ? 'Translating...' : 'Translate Now'}
          </button>
        </div>
      </div>

      {/* Side-by-Side View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Original Text */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Document Text (English)</span>
            <span className="text-[11px] text-slate-400 font-medium">Source: {selectedDoc?.title || 'No file selected'}</span>
          </div>

          <div className="min-h-[350px] max-h-[450px] overflow-y-auto pr-2 text-xs leading-relaxed text-slate-200 space-y-3 font-sans">
            {selectedDoc ? (
              <p className="whitespace-pre-wrap">{selectedDoc.original_text || selectedDoc.summary_text}</p>
            ) : (
              <p className="text-slate-400 italic">Please upload or select a document to view text.</p>
            )}
          </div>
        </div>

        {/* Right Column: Translated Text */}
        <div className="glass-panel rounded-3xl p-6 border border-indigo-500/30 space-y-4 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Translated Text ({targetLang})</span>
            </span>
            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([translatedText || "No translation available."], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `${selectedDoc?.title || 'document'}_${targetLang}.txt`;
                document.body.appendChild(element);
                element.click();
              }}
              className="text-xs text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          <div className="min-h-[350px] max-h-[450px] overflow-y-auto pr-2 text-xs leading-relaxed text-slate-100 space-y-3 font-sans">
            {translatedText ? (
              <p className="whitespace-pre-wrap leading-relaxed">{translatedText}</p>
            ) : (
              <div className="text-center py-20 text-slate-400 space-y-3">
                <Languages className="w-8 h-8 mx-auto text-indigo-400" />
                <p className="text-xs">Click <span className="font-bold text-indigo-400">"Translate Now"</span> to generate Indian language translation.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Signature Feature: AI Document Tutor Embedded Panel */}
      <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 bg-slate-900/80 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>★ Signature Feature: AI Document Tutor</span>
            </h3>
            <p className="text-[11px] text-slate-400">Ask questions directly from this document. Answers are translated into {targetLang} automatically!</p>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-3.5 rounded-2xl text-xs space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                {msg.translated_text && msg.translated_text !== msg.text && (
                  <div className="pt-2 mt-2 border-t border-slate-700/60 text-indigo-300">
                    <span className="font-bold block text-[10px] text-indigo-400 uppercase">[{targetLang} Translation]:</span>
                    <p className="italic">{msg.translated_text}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="text-slate-400 text-xs italic flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>AI Tutor is formulating answer from document...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendChat} className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder="Ask a question about this document..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Tutor</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default TranslationCenter;
