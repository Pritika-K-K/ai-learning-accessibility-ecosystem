import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { User, Settings, CheckCircle2, Shield, Languages, Volume2, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, updatePreferences, logout } = useAuth();
  const { fontSize, setFontSize, dyslexicFont, setDyslexicFont, highContrast, setHighContrast } = useAccessibility();
  const navigate = useNavigate();

  const [preferredLang, setPreferredLang] = useState(user?.preferred_language || 'English');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences({
        preferred_language: preferredLang,
        font_size: fontSize,
        dyslexic_font: dyslexicFont,
        high_contrast: highContrast
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">User Profile & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account details and default learning accessibility preferences.</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        
        {/* Profile Card */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-14 h-14 rounded-2xl object-cover border border-indigo-500/30" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {user?.full_name ? user.full_name.charAt(0) : 'S'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white">{user?.full_name || 'Student User'}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                {user?.role || 'Student'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-all flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Default Indian Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-2">
              <Languages className="w-4 h-4 text-indigo-400" />
              <span>Default Translation Language</span>
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Accessibility Modes</h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-medium text-slate-200">Dyslexia-Friendly Font (OpenDyslexic)</span>
              <input
                type="checkbox"
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-medium text-slate-200">High Contrast Color Scheme</span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-600"
              />
            </div>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Save Preferences
          </button>
        </form>

      </div>

    </div>
  );
};

export default Profile;
