import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Sparkles, UploadCloud, Languages, Volume2, HelpCircle, 
  MessageSquare, FileText, ArrowRight, CheckCircle2, TrendingUp, Clock, BookOpen
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', progress: 45, score: 85 },
  { day: 'Tue', progress: 60, score: 88 },
  { day: 'Wed', progress: 75, score: 90 },
  { day: 'Thu', progress: 70, score: 91 },
  { day: 'Fri', progress: 85, score: 93 },
  { day: 'Sat', progress: 92, score: 95 },
  { day: 'Sun', progress: 98, score: 96 },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        api.get('/stats'),
        api.get('/recent')
      ]);
      setStats(statsRes.data);
      setRecentDocs(recentRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Card Section */}
      <div className="relative glass-panel rounded-3xl p-8 border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Learnix Ecosystem Active</span>

            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{stats?.user_name || 'Student'}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Upload any study material — our AI ecosystem translates, simplifies, narrates, and quizzes you instantly.
            </p>
          </div>


        </div>



      </div>

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Upload PDF / Doc', icon: UploadCloud, path: '/upload', color: 'from-indigo-600 to-blue-600' },
            { label: 'Translate Text', icon: Languages, path: '/translation', color: 'from-purple-600 to-indigo-600' },
            { label: 'Audio Narration', icon: Volume2, path: '/accessibility', color: 'from-pink-600 to-purple-600' },
            { label: 'Generate Quiz', icon: HelpCircle, path: '/quiz', color: 'from-emerald-600 to-teal-600' },
            { label: 'Ask AI Tutor', icon: MessageSquare, path: '/chat', color: 'from-cyan-600 to-blue-600' },
            { label: 'Library Drive', icon: FileText, path: '/library', color: 'from-amber-600 to-orange-600' },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className="group p-4 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/50 hover:scale-105 transition-all text-center space-y-3"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="block text-xs font-semibold text-slate-200 group-hover:text-indigo-400">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards & Recent Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Documents Pipeline List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Recent Learning Documents</span>
            </h3>
            <Link to="/library" className="text-xs text-indigo-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDocs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p>No documents uploaded yet.</p>
              <Link to="/upload" className="text-indigo-400 underline font-semibold mt-2 block">Upload your first PDF or document</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase text-xs">
                      {doc.file_type}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{doc.title}</h4>
                      <p className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 inline" />
                        <span>{doc.pipeline_status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link to={`/translation`} className="px-3 py-1.5 rounded-lg bg-slate-800 text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-colors">
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Summary & Progress Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Learning Trends</span>
          </h3>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="progress" stroke="#818cf8" fillOpacity={1} fill="url(#colorProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Documents Uploaded</span>
              <span className="text-lg font-black text-indigo-400">{stats?.documents_uploaded || recentDocs.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Quizzes Done</span>
              <span className="text-lg font-black text-emerald-400">{stats?.quizzes_created || 0}</span>
            </div>
          </div>

        </div>

      </div>

      {/* AI Smart Suggestion Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            💡
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-200">AI Accessibility Suggestion</h4>
            <p className="text-xs text-slate-300">"Your recent biology notes contain technical terms. Would you like to generate a simplified audio summary in Tamil?"</p>
          </div>
        </div>
        <Link to="/accessibility" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-colors">
          Generate Audio
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
