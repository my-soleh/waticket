import React from 'react';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  TrendingUp,
  Inbox,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onOpenCreateModal }) => {
  const { tickets, incomingMessages, categories, settings, syncStatus, syncGoogleSheetNow } = useApp();

  // Metrics calculations
  const totalTickets = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'Baru' || t.status === 'Menunggu').length;
  const inProgressCount = tickets.filter(t => t.status === 'Diproses' || t.status === 'Diteruskan').length;
  const completedCount = tickets.filter(t => t.status === 'Selesai').length;
  const slaOverdueCount = tickets.filter(t => t.status === 'Terlambat SLA' || (t.status !== 'Selesai' && new Date(t.slaDeadline) < new Date())).length;

  const recentTickets = tickets.slice(0, 5);
  const unprocessedMessages = incomingMessages.filter(m => !m.isProcessed);

  // Status color badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Diteruskan':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Diproses':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Terlambat SLA':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
      case 'Darurat':
        return 'text-rose-600 font-bold';
      case 'Sedang':
        return 'text-amber-600 font-semibold';
      default:
        return 'text-emerald-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
              Layanan WA Active
            </span>
            <span className="text-xs text-emerald-200/80">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Ringkasan Aktivitas WATICKET</h2>
          <p className="text-xs text-emerald-100/80">
            Monitoring lalu lintas aduan masyarakat, penyaluran pesan ke PIC, dan progres penyelesaian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('simulasi-wa')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Simulasikan Pesan Masuk</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Buat Tiket Baru</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tiket</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalTickets}</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% dari kemarin
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Menunggu (Baru)</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingCount}</div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Perlu tindak lanjut</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Diproses / PIC</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{inProgressCount}</div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Sedang dikerjakan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selesai</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{completedCount}</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tuntas dikerjakan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Terlambat SLA</span>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{slaOverdueCount}</div>
            <span className="text-[10px] text-rose-500 font-medium">Perlu perhatian</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Tiket Masuk WA Inbox & Trend Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tiket Terbaru Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Tiket Terbaru Diterima</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Laporan aduan aktif yang membutuhkan atau sedang dalam penanganan</p>
              </div>
              <button
                onClick={() => setActiveTab('semua-tiket')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Kode Tiket</th>
                    <th className="py-3 px-3">Pelapor</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Prioritas</th>
                    <th className="py-3 px-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {recentTickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {t.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                        <div>{t.reporterName}</div>
                        <div className="text-[10px] text-slate-400">{t.reporterPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {t.category}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className={`py-3 px-3 ${getPriorityBadge(t.priority)}`}>
                        ● {t.priority}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {t.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Google Spreadsheet Sync & File Storage Info Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-slate-800 dark:to-slate-800 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Perekaman Data & Sinkronisasi Google Spreadsheet
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Seluruh data terekam di <code className="bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-mono text-[11px]">ticketing_wa_v2.json</code> dan tersinkronisasi langsung ke Google Drive Spreadsheet.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={syncGoogleSheetNow}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                >
                  Sinkronkan Sekarang
                </button>
                <a
                  href={settings.googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  <span>Buka Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Tiket Masuk WA Inbox Quick Dispatch Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pesan WA Belum Klasifikasi</h3>
              </div>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs font-bold rounded-full">
                {unprocessedMessages.length} Baru
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {unprocessedMessages.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Semua pesan WA dari masyarakat telah diklasifikasikan menjadi tiket!
                </div>
              ) : (
                unprocessedMessages.map(msg => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {msg.senderName} ({msg.senderPhone})
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "{msg.message}"
                    </p>

                    {/* Frame Kata Auto Keyword Suggestions */}
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Saran Kategori (Frame Kata):</span>
                        <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">
                          {msg.suggestedCategory}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Kata kunci cocok: {msg.matchedKeywords.length > 0 ? msg.matchedKeywords.join(', ') : 'Pengaduan Umum'}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('tiket-masuk')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Proses & Disposisi ke PIC</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
