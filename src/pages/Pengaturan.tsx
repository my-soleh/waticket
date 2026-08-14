import React, { useState } from 'react';
import {
  Settings,
  Phone,
  Key,
  FileSpreadsheet,
  Save,
  RotateCcw,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PengaturanProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Pengaturan: React.FC<PengaturanProps> = ({ darkMode, setDarkMode }) => {
  const { settings, updateSettings, showNotification } = useApp();

  const [adminPhone, setAdminPhone] = useState(settings.adminPhone);
  const [fonnteToken, setFonnteToken] = useState(settings.fonnteToken || '');
  const [googleSheetId, setGoogleSheetId] = useState(settings.googleSheetId);
  const [googleSheetUrl, setGoogleSheetUrl] = useState(settings.googleSheetUrl);
  const [appName, setAppName] = useState(settings.appName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adminPhone,
      fonnteToken,
      googleSheetId,
      googleSheetUrl,
      appName,
    });
    showNotification('success', 'Pengaturan sistem WATICKET berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pengaturan Sistem & Integrasi</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Konfigurasi gateway WhatsApp Fonnte, Google Spreadsheet Drive, dan Preferensi
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp & Fonnte Gateway Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <span>Integrasi Gateway WhatsApp (Fonnte API)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp Admin Utama:
              </label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Nomor ini digunakan sebagai penerima rujukan & verifikator utama
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Token Fonnte API Key (Opsional):
              </label>
              <input
                type="password"
                placeholder="Masukkan API Token Fonnte..."
                value={fonnteToken}
                onChange={e => setFonnteToken(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Jika diisi, pengiriman pesan WA akan dilakukan via API Fonnte otomatis
              </span>
            </div>
          </div>
        </div>

        {/* Google Sheet Sync Settings Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Perekaman File Data & Google Spreadsheet</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Berkas Penyimpanan Lokal:
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                ticketing_wa_v2.json
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Sheet ID:
                </label>
                <input
                  type="text"
                  required
                  value={googleSheetId}
                  onChange={e => setGoogleSheetId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Tautan Google Spreadsheet:
                </label>
                <input
                  type="text"
                  required
                  value={googleSheetUrl}
                  onChange={e => setGoogleSheetUrl(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tampilan & Preferensi System */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Tampilan Tema Aplikasi</span>
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {darkMode ? 'Mode Gelap' : 'Mode Terang'}
              </span>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl shadow-sm hover:scale-105 transition-transform"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul / Brand Sistem Layanan:
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
