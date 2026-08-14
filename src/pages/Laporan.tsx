import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  FileCode,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportTicketsToDOCX, exportTicketsToPDF, exportTicketsToXLSX } from '../lib/exportUtils';
import { GOOGLE_SHEET_URL } from '../lib/googleSheetSync';

export const Laporan: React.FC = () => {
  const { tickets, categories, syncStatus, syncGoogleSheetNow, settings, showNotification } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTickets = tickets.filter(t => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.picName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = filterCategory === 'semua' || t.category === filterCategory;
    const matchStat = filterStatus === 'semua' || t.status === filterStatus;

    return matchSearch && matchCat && matchStat;
  });

  const handleExportXLSX = () => {
    exportTicketsToXLSX(filteredTickets);
    showNotification('success', 'File Laporan Excel (.xlsx) berhasil diunduh');
  };

  const handleExportPDF = () => {
    exportTicketsToPDF(filteredTickets);
    showNotification('success', 'File Laporan PDF (.pdf) berhasil diunduh');
  };

  const handleExportDOCX = async () => {
    try {
      await exportTicketsToDOCX(filteredTickets);
      showNotification('success', 'File Laporan Word (.docx) berhasil diunduh');
    } catch (e) {
      showNotification('error', 'Gagal mengekspor file DOCX');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Laporan & Rekaman Data (Spreadsheet)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progres kendala laporan dalam spreadsheet (dapat diunduh format XLSX, PDF, & DOCX)
            </p>
          </div>
        </div>

        {/* Download Format Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportXLSX}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh XLSX</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>
          <button
            onClick={handleExportDOCX}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>Unduh DOCX</span>
          </button>
        </div>
      </div>

      {/* Google Spreadsheet Sync Info Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
                Google Drive Spreadsheet Sync Connected
              </span>
            </div>
            <h3 className="text-lg font-bold">Data Rekaman: ticketing_wa_v2</h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              File Google Spreadsheet live ID: <code className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-emerald-300">{settings.googleSheetId}</code>
              <br />
              Tersambung langsung untuk pemantauan realtime pimpinan dan publikasi laporan.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={syncGoogleSheetNow}
              disabled={syncStatus.isSyncing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus.isSyncing ? 'Menyingkronkan...' : 'Sinkronkan Live'}</span>
            </button>
            <a
              href={settings.googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>Buka Google Sheet</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Table Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Preview Tabel Spreadsheet ({filteredTickets.length} Tiket)
          </h3>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="semua">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Kode Tiket</th>
                <th className="py-3 px-3">Tanggal Lapor</th>
                <th className="py-3 px-3">Pelapor</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">PIC Pengampu</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Prioritas</th>
                <th className="py-3 px-3">Progres</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-mono">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-emerald-700 dark:text-emerald-400">{t.id}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{t.createdAt}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-900 dark:text-white">
                    {t.reporterName} ({t.reporterPhone})
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">{t.category}</td>
                  <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">{t.picName}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">{t.priority}</td>
                  <td className="py-3 px-3 font-bold text-emerald-600">{t.progressPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
