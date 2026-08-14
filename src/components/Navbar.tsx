import React, { useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Search,
  RefreshCw,
  Bell,
  FileSpreadsheet,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  setIsMobileOpen: (open: boolean) => void;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  setIsMobileOpen,
  onSearchChange,
  searchTerm = '',
  activeTab,
}) => {
  const { themeMode, toggleTheme, currentUser, syncStatus, syncGoogleSheetNow, incomingMessages, settings } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unprocessedMessages = incomingMessages.filter(m => !m.isProcessed);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Analytics';
      case 'tiket-masuk':
        return 'Tiket Masuk (Inbox WA)';
      case 'semua-tiket':
        return 'Kelola Semua Tiket';
      case 'laporan':
        return 'Laporan & Rekaman Data';
      case 'kategori':
        return 'Kategori & Frame Kata';
      case 'pic-struktur':
        return 'PIC & Struktur Biro';
      case 'simulasi-wa':
        return 'Simulasi Pesan WhatsApp';
      case 'pengaturan':
        return 'Pengaturan Sistem & API';
      default:
        return 'WATICKET System';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3.5">
        {/* Left Section: Mobile Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {getPageTitle(activeTab)}
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Sistem Ticketing & Layanan Pengaduan via WhatsApp
            </span>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-md w-full ml-4 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tiket, pelapor, atau nomor WhatsApp... (Ctrl + K)"
              value={searchTerm}
              onChange={e => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section: Controls & Status Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Spreadsheet Sync Badge & Button */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                Google Sheet
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400">
                {syncStatus.rowsCount} Baris Rekaman
              </span>
            </div>
            <button
              onClick={syncGoogleSheetNow}
              disabled={syncStatus.isSyncing}
              title="Sinkronkan Google Spreadsheet Sekarang"
              className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 rounded-lg transition-colors ml-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={settings.googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Google Spreadsheet"
              className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={themeMode === 'light' ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'}
          >
            {themeMode === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unprocessedMessages.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Pesan WA Masuk ({unprocessedMessages.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {unprocessedMessages.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                      Tidak ada pesan WA baru yang belum diproses.
                    </div>
                  ) : (
                    unprocessedMessages.map(msg => (
                      <div key={msg.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {msg.senderName} ({msg.senderPhone})
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          "{msg.message}"
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium">
                            Kategori: {msg.suggestedCategory}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {currentUser?.name || 'Admin WATICKET'}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                {currentUser?.role || 'Administrator'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md border border-emerald-400">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
