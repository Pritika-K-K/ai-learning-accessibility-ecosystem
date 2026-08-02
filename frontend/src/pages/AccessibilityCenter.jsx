import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Volume2, Play, Pause, Download, Eye, Sparkles, CheckCircle2, ShieldAlert, Sliders } from 'lucide-react';

const AccessibilityCenter = () => {
  const { fontSize, setFontSize, dyslexicFont, setDyslexicFont, highContrast, setHighContrast, readingGuide, setReadingGuide } = useAccessibility();
  
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [textToNarrate, setTextToNarrate] = useState('');
  const [voiceGender, setVoiceGender] = useState('Female');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [scoreData, setScoreData] = useState(null);

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
        setTextToNarrate(res.data[0].original_text || res.data[0].summary_text || '');
        fetchScore(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScore = async (docId) => {
    try {
      const res = await api.get(`/score/${docId}`);
      setScoreData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocChange = (docId) => {
    const doc = documents.find((d) => d.id === parseInt(docId));
    setSelectedDocId(docId);
    setSelectedDoc(doc);
    setTextToNarrate(doc?.original_text || doc?.summary_text || '');
    setAudioUrl(null);
    fetchScore(docId);
  };

  const handleGenerateTTS = async () => {
    if (!textToNarrate) return;
    setLoadingAudio(true);
    try {
      const res = await api.post(`/tts?document_id=${selectedDocId || 1}`, {
        text: textToNarrate,
        language: 'en',
        gender: voiceGender,
        speed: speechSpeed
      });
      setAudioUrl(`http://localhost:8000${res.data.audio_url}`);
    } catch (err) {
      alert('Audio narration generation failed.');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Module 6: Accessibility & Audio Narration Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Accessibility Suite</h1>
        </div>

        {/* Document Switcher */}
        <select
          value={selectedDocId || ''}
          onChange={(e) => handleDocChange(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          {documents.map((d) => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
      </div>

      {/* Grid: Audio Player & Reading Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Text-to-Speech & Narration Control */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-pink-400" />
              <span>AI Audio Narration & Captions</span>
            </h3>
            <span className="text-xs text-slate-400">Document: {selectedDoc?.title || 'Selected file'}</span>
          </div>

          {/* Voice Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Voice Gender</label>
              <select
                value={voiceGender}
                onChange={(e) => setVoiceGender(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Female">Female Voice (Natural)</option>
                <option value="Male">Male Voice (Deep)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Narration Speed</label>
              <select
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value={0.75}>0.75x (Slow / Accessible)</option>
                <option value={1.0}>1.0x (Normal)</option>
                <option value={1.25}>1.25x (Fast)</option>
                <option value={1.5}>1.5x (Speed Read)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateTTS}
                disabled={loadingAudio}
                className="w-full py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-colors shadow-md shadow-pink-500/20"
              >
                {loadingAudio ? 'Generating MP3...' : 'Generate Narration'}
              </button>
            </div>
          </div>

          {/* Audio Player Component */}
          {audioUrl && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-slate-900 border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300">Generated Narration MP3 Ready</span>
                <a
                  href={audioUrl}
                  download="narration.mp3"
                  className="text-xs text-pink-400 hover:underline flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </a>
              </div>
              <audio controls src={audioUrl} className="w-full h-10" />
            </div>
          )}

          {/* Text Content Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Narration Script Text:</label>
            <textarea
              rows={6}
              value={textToNarrate}
              onChange={(e) => setTextToNarrate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Right Col: Reading Modes & Accessibility Score */}
        <div className="space-y-6">
          
          {/* Reading Modes Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Accessibility Reading Modes</span>
            </h3>

            <div className="space-y-3">
              {/* Dyslexia-Friendly Font */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Dyslexia-Friendly Font</span>
                  <span className="text-[11px] text-slate-400">OpenDyslexic spacing for legibility</span>
                </div>
                <button
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    dyslexicFont ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {dyslexicFont ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">High Contrast Mode</span>
                  <span className="text-[11px] text-slate-400">Pure black and high contrast text</span>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {highContrast ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Reading Ruler Guide */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Reading Guide Ruler</span>
                  <span className="text-[11px] text-slate-400">Follow mouse focus overlay</span>
                </div>
                <button
                  onClick={() => setReadingGuide(!readingGuide)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    readingGuide ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {readingGuide ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Text Sizing */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">Text Sizing</span>
                <div className="flex items-center space-x-1">
                  {['small', 'medium', 'large', 'xlarge'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-1 rounded text-xs uppercase font-bold transition-colors ${
                        fontSize === size ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {size.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Score Card */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Document Readability Score</h4>
              <span className="text-2xl font-black text-emerald-400">{scoreData?.score || 88}%</span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              {scoreData?.suggestions.map((s, i) => (
                <div key={i} className="flex items-start space-x-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AccessibilityCenter;
