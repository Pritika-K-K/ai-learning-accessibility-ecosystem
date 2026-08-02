import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FolderKanban, Search, Star, Trash2, RotateCcw, FileText, Filter, Eye } from 'lucide-react';

const LearningLibrary = () => {
  const [items, setItems] = useState([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLibrary();
  }, [activeSubject, favoriteOnly, showTrash, searchQuery]);

  const fetchLibrary = async () => {
    try {
      const params = new URLSearchParams();
      if (activeSubject) params.append('subject', activeSubject);
      if (favoriteOnly) params.append('favorite_only', 'true');
      if (showTrash) params.append('trashed', 'true');
      if (searchQuery) params.append('query', searchQuery);

      const res = await api.get(`/library?${params.toString()}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await api.post(`/library/toggle-favorite/${id}`);
      fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrashOrRestore = async (id) => {
    try {
      if (showTrash) {
        await api.post(`/library/restore/${id}`);
      } else {
        await api.delete(`/document/${id}`);
      }
      fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Module 9: Google Drive Style Learning Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Learning Library</h1>
        </div>

        {/* View Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              showTrash ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{showTrash ? 'Viewing Trash' : 'Trash'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Subjects & Favorites Filters */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {['', 'Computer Science', 'Mathematics', 'Biology', 'History', 'General'].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSubject === sub ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sub === '' ? 'All Subjects' : sub}
            </button>
          ))}

          <button
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
              favoriteOnly ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 text-xs">
            No documents found matching filters.
          </div>
        ) : (
          items.map((doc) => (
            <div key={doc.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase text-xs">
                    {doc.file_type}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{doc.title}</h3>
                    <span className="text-[11px] text-slate-400 font-medium block">{doc.subject}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFavorite(doc.id)}
                  className={`p-1.5 rounded-lg transition-colors ${doc.is_favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 line-clamp-3">
                {doc.original_text || doc.summary_text || 'No text content preview.'}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-emerald-400 font-medium">Score: {doc.accessibility_score}%</span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTrashOrRestore(doc.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    {showTrash ? <RotateCcw className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default LearningLibrary;
