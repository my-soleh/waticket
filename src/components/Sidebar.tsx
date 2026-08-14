import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Ticket,
  FileSpreadsheet,
  Tags,
  Users,
  Settings,
  MessageSquareCode,
  LogOut,
  Wifi,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { incomingMessages, currentUser, logout, settings } = useApp();

  const unprocessedCount = incomingMessages.filter(m => !m.isProcessed).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tiket-masuk', label: 'Tiket Masuk', icon: Inbox, badge: unprocessedCount },
    { id: 'semua-tiket', label: 'Semua Tiket', icon: Ticket },
    { id: 'laporan', label: 'Laporan', icon: FileSpreadsheet },
    { id: 'kategori', label: 'Kategori', icon: Tags },
    { id: 'pic-struktur', label: 'PIC & Struktur Biro', icon: Users },
    { id: 'simulasi-wa', label: 'Simulasi WA (Fonnte)', icon: MessageSquareCode },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="p-5 border-b border-emerald-800/50">
          <Logo size="md" lightText />
        </div>

        {/* Main Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 mb-2 text-[11px] font-semibold text-emerald-300/70 uppercase tracking-wider">
            Menu Utama
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 font-semibold'
                    : 'text-emerald-100/80 hover:bg-emerald-800/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-emerald-300/80'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-4 h-4 text-emerald-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* WhatsApp Connection Status Widget */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Fonnte WA API
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Terhubung
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/70 truncate mb-2">
            WA Admin: {settings.adminPhone}
          </p>
          <button
            onClick={() => handleNavClick('pengaturan')}
            className="w-full text-center py-1.5 text-xs font-medium bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Lihat Log & Token</span>
          </button>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-emerald-800/50 bg-emerald-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-inner">
              {currentUser?.name.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">
                {currentUser?.name || 'Admin'}
              </span>
              <span className="text-xs text-emerald-300/80 truncate">
                {currentUser?.role === 'admin' ? 'Administrator' : 'PIC Biro'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Keluar"
            className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors flex-shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>
    </>
  );
};
