import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Heart, Shield, Accessibility, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Learnix</span>

            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              An all-in-one accessibility-first learning platform that translates, simplifies, narrates, and quizzes students on their study materials.
            </p>
            <div className="flex items-center space-x-2 text-xs text-indigo-400 font-medium">
              <Accessibility className="w-4 h-4 text-emerald-400" />
              <span>WCAG 2.1 AAA Accessibility Compliant</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/upload" className="hover:text-indigo-400 transition-colors">Upload & OCR Center</Link></li>
              <li><Link to="/translation" className="hover:text-indigo-400 transition-colors">Indian Languages Translation</Link></li>
              <li><Link to="/accessibility" className="hover:text-indigo-400 transition-colors">Text-to-Speech & Captions</Link></li>
              <li><Link to="/quiz" className="hover:text-indigo-400 transition-colors">Smart Quiz Generator</Link></li>
              <li><Link to="/chat" className="hover:text-indigo-400 transition-colors">AI Study Assistant (RAG)</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details (As Requested) */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>support@ailearningecosystem.edu</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>+1 (800) 555-ACCESSIBLE (532-76)</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>100 Innovation Parkway, Suite 400, Tech Campus, CA 94025</span>
              </li>
              <li className="flex items-start space-x-3">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>24/7 Inclusive Learning Helpline</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Technology & Security */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Technology Architecture</h3>
            <p className="text-xs text-slate-400 mb-3">
              FastAPI REST Backend • React SPA Frontend • PostgreSQL Database • Google OAuth • Gemini AI Engine
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-medium text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Enterprise Grade Security</span>
              </div>
              <p className="text-[11px]">JWT Auth, Google Identity Protection, encrypted document storage.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Learnix Accessibility Ecosystem. All rights reserved.</p>

          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for accessible education worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
