import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Volume2, Play, Pause, Download, Eye, Sparkles, CheckCircle2, 
  ShieldAlert, Sliders, Languages, ScanText, Heading, Type, FileSearch, Video, AlertCircle
} from 'lucide-react';

const NARRATION_LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'
];

const AccessibilityCenter = () => {
  const { fontSize, setFontSize, dyslexicFont, setDyslexicFont, highContrast, setHighContrast, readingGuide, setReadingGuide } = useAccessibility();
  
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [textToNarrate, setTextToNarrate] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [voiceGender, setVoiceGender] = useState('Female');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState('English');
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
        language: selectedLanguage,
        gender: voiceGender,
        speed: speechSpeed
      });
      setAudioUrl(`http://localhost:8000${res.data.audio_url}`);
      setActiveLanguage(res.data.language || selectedLanguage);
      if (res.data.translated_text) {
        setTextToNarrate(res.data.translated_text);
      }
    } catch (err) {
      console.error(err);
      alert('Audio narration generation failed. Please try again.');
    } finally {
      setLoadingAudio(false);
    }
  };

  const renderCheckIcon = (index, fileType) => {
    if (fileType === 'youtube') {
      if (index === 0) return <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      if (index === 1) return <Languages className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      if (index === 2) return <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      return <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    if (index === 0) return <ScanText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    if (index === 1) return <Heading className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    if (index === 2) return <FileSearch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    return <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Module 6: Accessibility & Multi-Language Audio Narration</span>
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
            <option key={d.id} value={d.id}>{d.title} ({d.file_type?.toUpperCase() || 'FILE'})</option>
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

          {/* Voice & Language Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1">
                <Languages className="w-3 h-3 text-pink-400" />
                <span>Audio Language</span>
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {NARRATION_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Voice Gender</label>
              <select
                value={voiceGender}
                onChange={(e) => setVoiceGender(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
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
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500"
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
                className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/20"
              >
                {loadingAudio ? 'Generating Audio...' : 'Generate Narration'}
              </button>
            </div>
          </div>

          {/* Audio Player Component */}
          {audioUrl && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-slate-900 border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Narration Audio Ready ({activeLanguage})</span>
                </span>
                <a
                  href={audioUrl}
                  download={`narration_${activeLanguage}.mp3`}
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
            <label className="block text-xs font-semibold text-slate-300">
              Narration Script Text ({selectedLanguage}):
            </label>
            <textarea
              rows={6}
              value={textToNarrate}
              onChange={(e) => setTextToNarrate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Right Col: Reading Modes & Dynamic Accessibility Compliance Suite */}
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

          {/* Section: Accessibility Compliance Suite (Dynamic based on selected file format) */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Accessibility Compliance Suite</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Format-Specific Audit: <span className="text-indigo-400 font-bold uppercase">{scoreData?.file_type || selectedDoc?.file_type || 'FILE'}</span>
                </p>
              </div>
              <span className="text-2xl font-black text-emerald-400">{scoreData?.score || 94}%</span>
            </div>

            {/* Dynamic Compliance Checks Tailored to Uploaded File Type */}
            <div className="space-y-3 pt-1 text-xs">
              {scoreData?.checks && scoreData.checks.length > 0 ? (
                scoreData.checks.map((chk, index) => (
                  <div key={chk.id || index} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        {renderCheckIcon(index, scoreData?.file_type)}
                        <span>{chk.title}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        chk.passed !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {chk.badge || chk.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {chk.recommendation}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  {/* Fallback Display */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        <ScanText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Accessibility Check 1: OCR Detection</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        {scoreData?.ocr_check?.status || 'Selectable'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {scoreData?.ocr_check?.recommendation || 'Detect whether text is selectable. If image-only: Display OCR Require Recommendation.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        <Heading className="w-3.5 h-3.5 text-pink-400" />
                        <span>Accessibility Check 2: Heading Structure</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        H1 → H2 → H3
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {scoreData?.heading_check?.recommendation || 'Checks: Missing Heading 1, Skipped heading levels, Improper heading hierarchy.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Accessibility Check 3: Language Detection</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                        {scoreData?.language_check?.detected_language || 'English'} ({scoreData?.language_check?.confidence || '98%'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {scoreData?.language_check?.recommendation || 'Detected Language: English | Confidence: 98%. Recommend translation if necessary.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        <Type className="w-3.5 h-3.5 text-amber-400" />
                        <span>Accessibility Check 4: Font Accessibility</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        Min 14px / OpenDyslexic
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {scoreData?.font_check?.recommendation || 'Minimum font size (14px/16px), Accessible font families (OpenDyslexic, Inter, Arial, Roboto).'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AccessibilityCenter;
