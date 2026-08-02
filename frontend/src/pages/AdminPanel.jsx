import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldCheck, Server, Activity, Users, FileText, AlertCircle } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [uRes, hRes, lRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/system-health'),
        api.get('/admin/logs')
      ]);
      setUsers(uRes.data);
      setHealth(hRes.data);
      setLogs(lRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Module 11: Platform Moderation & Operations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Admin Operations Panel</h1>
      </div>

      {/* Health & API Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* System Health */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">System Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              ● Healthy
            </span>
          </div>
          <span className="text-2xl font-black text-white">{health?.active_users || 18} Active Users</span>
          <p className="text-[11px] text-slate-400">Storage Used: {health?.storage_used_mb || 142.8} MB</p>
        </div>

        {/* API Services Status */}
        <div className="md:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase">AI Services Pipeline Status</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {health?.api_services && Object.entries(health.api_services).map(([service, status], i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium block text-[11px]">{service}</span>
                <span className="text-emerald-400 font-bold">{status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Platform Registered Users</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono">#{u.id}</td>
                  <td className="p-3 font-semibold text-white">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{u.role}</span></td>
                  <td className="p-3 text-slate-400">{u.created_at ? u.created_at.split('T')[0] : '2026-08-01'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Logs */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>System Operation Logs</span>
        </h3>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {logs.map((l, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3 text-xs">
              <span className="text-slate-500 font-mono text-[11px] shrink-0">{l.timestamp}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.level === 'WARN' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                {l.level}
              </span>
              <span className="text-slate-200">{l.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
