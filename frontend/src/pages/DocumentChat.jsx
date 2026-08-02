import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Bot, Send, Volume2, Languages, Sparkles, BookOpen } from 'lucide-react';

const DocumentChat = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [question, setQuestion] = useState('');
  const [simplify, setSimplify] = useState(false);
  const [targetLang, setTargetLang] = useState('English');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedDocId) return;

    const qText = question;
    setQuestion('');
    setChatLog((prev) => [...prev, { role: 'user', content: qText }]);
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        document_id: parseInt(selectedDocId),
        question: qText,
        target_language: targetLang,
        simplify: simplify
      });

      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.answer,
          translated: res.data.translated_answer
        }
      ]);
    } catch (err) {
      setChatLog((prev) => [...prev, { role: 'assistant', content: 'Failed to retrieve answer from document.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Module 7: AI Study Assistant (Document Chat)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Document Q&A Tutor</h1>
        </div>

        <select
          value={selectedDocId || ''}
          onChange={(e) => setSelectedDocId(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
        >
          {documents.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
      </div>

      {/* Chat Window */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 min-h-[450px] flex flex-col justify-between">
        
        {/* Messages */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {chatLog.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <Bot className="w-10 h-10 mx-auto text-indigo-400" />
              <p className="text-xs">Ask any question about your selected document.</p>
            </div>
          ) : (
            chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.translated && msg.translated !== msg.content && (
                    <div className="pt-2 border-t border-slate-800 text-indigo-300">
                      <span className="text-[10px] font-bold uppercase text-indigo-400 block">[{targetLang}]:</span>
                      <p>{msg.translated}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="text-xs text-indigo-400 italic flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>RAG Assistant querying document embeddings...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Controls */}
        <form onSubmit={handleAsk} className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-4 text-xs text-slate-300">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={simplify}
                onChange={(e) => setSimplify(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-600"
              />
              <span>"Explain Simply" Mode</span>
            </label>

            <div className="flex items-center space-x-1.5">
              <span>Translate Answer to:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-indigo-300 font-semibold"
              >
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};

export default DocumentChat;
