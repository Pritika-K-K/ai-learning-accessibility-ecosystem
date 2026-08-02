import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud, FileText, Link as LinkIcon, Youtube, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const UploadCenter = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('file'); // file, text, url, youtube
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [url, setUrl] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreview(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'File upload failed. Please try a TXT, PDF, DOCX, or Image file.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextUpload = async (e) => {
    e.preventDefault();
    const titleToUse = textTitle.trim() || 'Study Notes';
    const contentToUse = rawText.trim();

    if (!contentToUse) {
      setErrorMsg('Please paste study text before saving.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/upload/text', {
        title: titleToUse,
        text: contentToUse,
        subject: subject
      });
      setPreview(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Text upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('Please enter a valid Web page or YouTube video URL.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/upload/url', {
        url: url.trim(),
        subject: subject
      });
      setPreview(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to extract text from URL/YouTube video. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Module 3: Upload & Ingestion Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Upload Study Materials</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Ingest PDF, DOCX, PPT, Images, text, or web links. Our OCR and AI pipeline prepares them for translation, narration, and quizzes.
        </p>
      </div>

      {/* Upload Method Tabs */}
      <div className="flex items-center justify-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 max-w-xl mx-auto">
        {[
          { id: 'file', label: 'File Upload', icon: UploadCloud },
          { id: 'text', label: 'Paste Text', icon: FileText },
          { id: 'url', label: 'Web URL', icon: LinkIcon },
          { id: 'youtube', label: 'YouTube Transcript', icon: Youtube },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg('');
              }}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Upload Box */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 max-w-2xl mx-auto shadow-2xl">
        
        {/* Subject Tag Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Subject / Category</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Computer Science">Computer Science & AI</option>
            <option value="Mathematics">Mathematics & Physics</option>
            <option value="Biology">Biology & Medicine</option>
            <option value="History">History & Social Studies</option>
            <option value="General">General Education</option>
          </select>
        </div>

        {/* Tab Content: File Upload */}
        {activeTab === 'file' && (
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 text-center bg-slate-900/50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">
                {file ? file.name : 'Drag & drop study file here, or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, PPTX, TXT, Images (OCR enabled)</p>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'Processing Document & Extracting Text...' : 'Process Document with AI'}</span>
            </button>
          </form>
        )}

        {/* Tab Content: Paste Text */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="e.g. Chapter 4: Neural Networks Summary"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Paste Raw Text</label>
              <textarea
                rows={6}
                required
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste study material text here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              {loading ? 'Ingesting Text...' : 'Save & Ingest Text'}
            </button>
          </form>
        )}

        {/* Tab Content: URL & YouTube */}
        {(activeTab === 'url' || activeTab === 'youtube') && (
          <form onSubmit={handleUrlUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {activeTab === 'url' ? 'Educational Web Page URL' : 'YouTube Video Link'}
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={activeTab === 'url' ? 'https://en.wikipedia.org/wiki/Artificial_intelligence' : 'https://www.youtube.com/watch?v=...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              {loading ? 'Importing Content...' : 'Import Content & Extract Text'}
            </button>
          </form>
        )}

      </div>

      {/* Success & Live Extracted Preview */}
      {preview && (
        <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Document Ingested & Processed Successfully!</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Extracted Text Preview:</h4>
            <p className="text-xs text-slate-200 line-clamp-4 leading-relaxed font-mono">
              {preview.original_text}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => navigate('/translation')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              Go to Translation Center →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UploadCenter;
