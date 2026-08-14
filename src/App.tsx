import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Ticket,
  FileSpreadsheet,
  Tag,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Download,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { TiketMasuk } from './pages/TiketMasuk';
import { SemuaTiket } from './pages/SemuaTiket';
import { Laporan } from './pages/Laporan';
import { Kategori } from './pages/Kategori';
import { PicStruktur } from './pages/PicStruktur';
import { SimulasiWA } from './pages/SimulasiWA';
import { Pengaturan } from './pages/Pengaturan';
import { CreateTicketModal } from './components/CreateTicketModal';
import { exportTicketsToXLSX } from './lib/exportUtils';

const MainAppContent: React.FC = () => {
  const { notification, hideNotification, incomingMessages, tickets, settings, syncStatus, themeMode, toggleTheme, setThemeMode } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const darkMode = themeMode === 'dark';

  // Unprocessed messages count for badge
  const unprocessedCount = incomingMessages.filter(m => !m.isProcessed).length;

  const handleExportQuick = () => {
    exportTicketsToXLSX(tickets);
  };

  return (
    <div className={`flex h-screen w-full bg-[#F8FAFC] dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all border ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : notification.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-200" />
          )}
          <span>{notification.message}</span>
          <button onClick={hideNotification} className="p-1 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0F172A] flex flex-col flex-shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg tracking-wider">
            NF
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight block leading-tight">
              WATICKET
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
              v2.0 • Disposisi WA
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-2 flex-1 px-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'dashboard'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tiket-masuk')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'tiket-masuk'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Antrian Tiket Masuk</span>
            </div>
            {unprocessedCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-extrabold">
                {unprocessedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('semua-tiket')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'semua-tiket'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4" />
              <span>Semua Tiket Laporan</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-bold">{tickets.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'laporan'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Rekaman Spreadsheet</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('kategori')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'kategori'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Kategori & Keywords</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pic-struktur')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'pic-struktur'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Data WhatsApp PIC</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('simulasi-wa')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'simulasi-wa'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Simulasi WhatsApp Warga</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-xs ${
              activeTab === 'pengaturan'
                ? 'bg-[#1E293B] text-emerald-400 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Pengaturan System</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Status Footer Card */}
        <div className="p-4 border-t border-slate-800 m-4 bg-[#1E293B] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] text-slate-300 font-mono">Fonnte API: Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[11px] text-slate-300 font-mono">GDrive Sync: OK</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.0</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
              {activeTab === 'dashboard' && 'Dashboard Overview Layanan WATICKET'}
              {activeTab === 'tiket-masuk' && 'Antrian WhatsApp Masuk (Inbound)'}
              {activeTab === 'semua-tiket' && 'Semua Tiket Laporan Masyarakat'}
              {activeTab === 'laporan' && 'Laporan Spreadsheet Data'}
              {activeTab === 'kategori' && 'Kategori & Algoritma Frame Kata'}
              {activeTab === 'pic-struktur' && 'Data Penanggung Jawab (PIC Biro)'}
              {activeTab === 'simulasi-wa' && 'Simulasi Pesan WhatsApp Warga'}
              {activeTab === 'pengaturan' && 'Pengaturan Integrasi System'}
            </h1>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            {/* Light / Dark Mode Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600 shadow-sm"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mode Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mode Gelap</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Export Data Button */}
            <button
              onClick={handleExportQuick}
              className="px-3.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export XLSX</span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Administrator
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  System Admin
                </p>
              </div>
              <div className="w-9 h-9 bg-emerald-600 text-white font-black rounded-xl flex items-center justify-center text-xs shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* View Page Renderer Container */}
        <section className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}
          {activeTab === 'tiket-masuk' && <TiketMasuk />}
          {activeTab === 'semua-tiket' && (
            <SemuaTiket onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          )}
          {activeTab === 'laporan' && <Laporan />}
          {activeTab === 'kategori' && <Kategori />}
          {activeTab === 'pic-struktur' && <PicStruktur />}
          {activeTab === 'simulasi-wa' && <SimulasiWA />}
          {activeTab === 'pengaturan' && (
            <Pengaturan
              darkMode={darkMode}
              setDarkMode={val => setThemeMode(val ? 'dark' : 'light')}
            />
          )}
        </section>
      </main>

      {/* Manual Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
