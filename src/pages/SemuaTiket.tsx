import React, { useState } from 'react';
import {
  Ticket,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  X,
  Plus,
  ExternalLink,
  ChevronDown,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatWhatsAppPhone, generateWhatsAppLink, formatTicketForPICWA, formatTicketForReporterWA } from '../lib/fonnteApi';
import { Ticket as TicketType, TicketStatus, TicketPriority } from '../types';

interface SemuaTiketProps {
  onOpenCreateModal: () => void;
  initialSearch?: string;
}

export const SemuaTiket: React.FC<SemuaTiketProps> = ({ onOpenCreateModal, initialSearch = '' }) => {
  const { tickets, categories, pics, updateTicketStatus, addProgressNote, forwardTicketToPIC, showNotification, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [filterPic, setFilterPic] = useState<string>('semua');

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newStatus, setNewStatus] = useState<TicketStatus>('Diproses');

  // Filter logic
  const filteredTickets = tickets.filter(t => {
    const matchSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reporterPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'semua' || t.status === filterStatus;
    const matchCategory = filterCategory === 'semua' || t.category === filterCategory;
    const matchPic = filterPic === 'semua' || t.picId === filterPic;

    return matchSearch && matchStatus && matchCategory && matchPic;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateTicketStatus(selectedTicket.id, newStatus, newNoteText || undefined);
    setNewNoteText('');
    showNotification('success', `Status tiket ${selectedTicket.id} diperbarui`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newNoteText.trim()) return;

    addProgressNote(selectedTicket.id, newNoteText);
    setNewNoteText('');
  };

  const getStatusBadgeClass = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola Semua Tiket Pengaduan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencarian, pemantauan progres, dan pembaruan catatan laporan WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tiket Manual</span>
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode, nama, atau kata..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="semua">Semua Status Tiket</option>
            <option value="Baru">Baru</option>
            <option value="Diteruskan">Diteruskan</option>
            <option value="Diproses">Diproses</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Selesai">Selesai</option>
            <option value="Terlambat SLA">Terlambat SLA</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="semua">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* PIC Filter */}
          <select
            value={filterPic}
            onChange={e => setFilterPic(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="semua">Semua PIC Biro</option>
            {pics.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Kode Tiket</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Pelapor</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">PIC / Pengampu</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Prioritas</th>
                <th className="py-3.5 px-4">Progres</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ditemukan tiket yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {t.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {t.createdAt}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      <div>{t.reporterName}</div>
                      <div className="text-[10px] text-slate-400">{t.reporterPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {t.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {t.picName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {t.priority}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all"
                          style={{ width: `${t.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{t.progressPercentage}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedTicket(t);
                          setNewStatus(t.status);
                        }}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center justify-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail & Progress Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
              <div>
                <span className="text-xs text-emerald-200 font-mono font-bold uppercase tracking-wider">
                  Detail Tiket Layanan WA
                </span>
                <h3 className="text-xl font-bold">{selectedTicket.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Ticket Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Identitas Pelapor:</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedTicket.reporterName}</div>
                  <div className="text-slate-600 dark:text-slate-300">No. WA: {selectedTicket.reporterPhone}</div>
                  <div className="text-slate-500">Alamat: {selectedTicket.reporterAddress || '-'}</div>

                  {/* Direct WhatsApp Link to Reporter */}
                  <div className="pt-2">
                    <a
                      href={generateWhatsAppLink(
                        selectedTicket.reporterPhone,
                        formatTicketForReporterWA(selectedTicket)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Pelapor via WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Penanggung Jawab (PIC):</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedTicket.picName}</div>
                  <div className="text-slate-600 dark:text-slate-300">No. WA PIC: {selectedTicket.picPhone}</div>
                  <div className="text-slate-500">Target SLA: {selectedTicket.slaDeadline}</div>

                  {/* Direct WhatsApp Link to PIC */}
                  <div className="pt-2">
                    <a
                      href={generateWhatsAppLink(selectedTicket.picPhone, formatTicketForPICWA(selectedTicket))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Disposisi ke WA PIC</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Rincian Aduan */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Rincian Pengaduan:</div>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  "{selectedTicket.description}"
                </p>
              </div>

              {/* Update Status & Progress Form */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-3">
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Update Progres & Status Penanganan
                </h4>

                <form onSubmit={handleUpdateStatus} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Pilih Status Baru:
                      </label>
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value as TicketStatus)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                      >
                        <option value="Diteruskan">Diteruskan</option>
                        <option value="Diproses">Diproses (In Progress)</option>
                        <option value="Menunggu">Menunggu Tambahan Data</option>
                        <option value="Selesai">Selesai (Resolved)</option>
                        <option value="Ditutup">Ditutup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Catatan Petugas / Progress Note:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Tim lapangan sudah menyelesaikan penambalan..."
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Simpan & Kirim Notifikasi WA ke Pelapor
                  </button>
                </form>
              </div>

              {/* Progress Timeline Notes */}
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                  Riwayat Catatan & Progres ({selectedTicket.notes.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedTicket.notes.map(note => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white mb-1">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{note.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
