import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  LayoutDashboard, UploadCloud, Languages, Volume2, HelpCircle, 
  MessageSquare, FolderKanban, BarChart3, ShieldCheck, User, 
  LogOut, LogIn, Eye, Sparkles, Menu, X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dyslexicFont, setDyslexicFont, highContrast, setHighContrast, readingGuide, setReadingGuide } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload', path: '/upload', icon: UploadCloud },
    { name: 'Translate', path: '/translation', icon: Languages },
    { name: 'Accessibility', path: '/accessibility', icon: Volume2 },
    { name: 'Quizzes', path: '/quiz', icon: HelpCircle },
    { name: 'AI Tutor', path: '/chat', icon: MessageSquare },
    { name: 'Library', path: '/library', icon: FolderKanban },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-wide group-hover:text-indigo-400 transition-colors">
                Learnix
              </span>
              <span className="text-[11px] text-indigo-400 block font-medium -mt-1">Accessibility Ecosystem</span>

            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Accessibility Toggles & User Auth Profile */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Quick Dyslexia Font Toggle */}
            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              title="Toggle Dyslexia-Friendly Font"
              className={`p-2 rounded-lg border text-xs font-bold transition-colors ${
                dyslexicFont 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Aa
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              title="Toggle High Contrast Mode"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                highContrast 
                  ? 'bg-yellow-400 text-black font-bold border-yellow-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Reading Guide Toggle */}
            <button
              onClick={() => setReadingGuide(!readingGuide)}
              title="Toggle Reading Ruler Guide"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                readingGuide 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              📏
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1" />

            {/* User Profile or Login Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-indigo-500 text-xs font-medium transition-all"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user.full_name || user.email.split('@')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm block"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
