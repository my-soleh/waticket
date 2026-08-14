import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<'admin' | 'pic' | 'pelapor'>('admin');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, role);
  };

  const setPresetUser = (presetName: string, presetRole: 'admin' | 'pic' | 'pelapor') => {
    setUsername(presetName);
    setPassword('123456');
    setRole(presetRole);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-950">
      {/* Background Image Layer (background.png) with Blur & Responsive Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-sm opacity-40 transition-all duration-700"
        style={{ backgroundImage: `url('/background.png')` }}
      />

      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/90 via-slate-950/80 to-emerald-900/40" />

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800/60 p-6 sm:p-8 transition-all">
        {/* Top Header Logo (nfis.svg / logo NFIS.png) */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-gradient-to-b from-emerald-500/10 to-emerald-600/20 rounded-2xl border border-emerald-500/30 mb-3 shadow-inner">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            WATICKET
          </h1>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
            Sistem Ticketing & Layanan Pengaduan via WhatsApp
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Silakan login untuk mengelola laporan dan pengaduan masyarakat
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Username / No. WhatsApp
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Akses Peran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'admin'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Admin WA
              </button>
              <button
                type="button"
                onClick={() => setRole('pic')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'pic'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                PIC Biro
              </button>
              <button
                type="button"
                onClick={() => setRole('pelapor')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'pelapor'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Pelapor
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Ingat Sesi Saya</span>
            </label>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
              Bantuan WA?
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Section */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Akses Cepat:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPresetUser('admin', 'admin')}
              className="p-2 text-left bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Admin Utama
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Disposisi WA</div>
            </button>
            <button
              onClick={() => setPresetUser('Ir. Ahmad Zulkarnain', 'pic')}
              className="p-2 text-left bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                PIC Dinas PU
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pengaduan Jalan</div>
            </button>
          </div>
        </div>

        {/* Footer Credit & File Record Note */}
        <div className="mt-6 text-center text-[10px] text-slate-400">
          Fonnte WA API Integrated • Rekaman Data: <span className="font-mono text-emerald-500">ticketing_wa_v2</span>
        </div>
      </div>
    </div>
  );
};
