import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck } from 'lucide-react';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please check your credentials or create a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Quick sign-in failed. Please try logging in with your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email and password to access your Learnix Hub</p>

        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In with Email & Password'}</span>
          </button>
        </form>

        <div className="my-5 flex items-center justify-between text-slate-500 text-xs">
          <div className="h-px bg-slate-800 w-1/3" />
          <span>OR</span>
          <div className="h-px bg-slate-800 w-1/3" />
        </div>

        {/* 1-Click Instant Quick Sign-In Option */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-indigo-500/40 hover:bg-slate-800 text-indigo-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md"
        >
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>⚡ Quick Sign-In (Student Account)</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-medium hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
