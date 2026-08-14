import React, { useState } from 'react';
import { X, Plus, Send, Ticket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TicketPriority } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose }) => {
  const { categories, pics, createManualTicket, showNotification } = useApp();

  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterAddress, setReporterAddress] = useState('');
  const [categoryName, setCategoryName] = useState(categories[0]?.name || '');
  const [priority, setPriority] = useState<TicketPriority>('Tinggi');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !reporterPhone.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const ticket = await createManualTicket({
        reporterName,
        reporterPhone,
        reporterAddress,
        category: categoryName,
        priority,
        description,
      });

      if (ticket) {
        showNotification('success', `Tiket ${ticket.id} berhasil dibuat manual!`);
        // Reset
        setReporterName('');
        setReporterPhone('');
        setReporterAddress('');
        setDescription('');
        onClose();
      }
    } catch (err) {
      showNotification('error', 'Gagal membuat tiket manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCat = categories.find(c => c.name === categoryName) || categories[0];
  const assignedPic = pics.find(p => p.id === selectedCat?.defaultPicId) || pics[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">Buat Tiket Pengaduan Manual</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Warga Pelapor: *
              </label>
              <input
                type="text"
                required
                placeholder="Nama lengkap"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp Warga: *
              </label>
              <input
                type="text"
                required
                placeholder="08123456789"
                value={reporterPhone}
                onChange={e => setReporterPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lokasi Aduan:
            </label>
            <input
              type="text"
              placeholder="Contoh: Jl. Pemuda No 12, RT 02 / RW 04"
              value={reporterAddress}
              onChange={e => setReporterAddress(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Pengaduan:
              </label>
              <select
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} (SLA: {c.slaHours}j)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Prioritas:
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Darurat">Darurat</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          </div>

          {/* Assigned PIC Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Otomatis Diteruskan Ke:</span>
            <div className="font-bold text-slate-900 dark:text-white">
              {assignedPic?.name} ({assignedPic?.division})
            </div>
            <div className="text-slate-500 font-mono text-[11px]">No. WA PIC: {assignedPic?.phone}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rincian Pengaduan Lengkap: *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan detail laporan warga..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Membuat Tiket...' : 'Simpan & Diteruskan ke WA PIC'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
