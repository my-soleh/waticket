import React, { useState } from 'react';
import {
  Inbox,
  Sparkles,
  Send,
  CheckCircle2,
  Filter,
  Search,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TicketPriority } from '../types';

export const TiketMasuk: React.FC = () => {
  const { incomingMessages, categories, pics, processIncomingMessage, showNotification } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(
    incomingMessages.find(m => !m.isProcessed)?.id || incomingMessages[0]?.id || null
  );

  const selectedMsg = incomingMessages.find(m => m.id === selectedMsgId);

  // Form states for dispatching ticket
  const [targetCategory, setTargetCategory] = useState<string>(selectedMsg?.suggestedCategory || categories[0]?.name || '');
  const [priority, setPriority] = useState<TicketPriority>('Tinggi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update category when selecting a message
  React.useEffect(() => {
    if (selectedMsg) {
      setTargetCategory(selectedMsg.suggestedCategory || categories[0]?.name || '');
    }
  }, [selectedMsgId]);

  const matchedCatObj = categories.find(c => c.name === targetCategory) || categories[0];
  const assignedPicObj = pics.find(p => p.id === matchedCatObj?.defaultPicId) || pics[0];

  const filteredMessages = incomingMessages.filter(msg => {
    if (filterCategory === 'belum_diproses') return !msg.isProcessed;
    if (filterCategory === 'selesai') return msg.isProcessed;
    return true;
  });

  const handleDispatchTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg) return;

    setIsSubmitting(true);
    try {
      const ticket = await processIncomingMessage(selectedMsg.id, targetCategory, priority);
      if (ticket) {
        showNotification('success', `Tiket ${ticket.id} dibuat & diteruskan ke WhatsApp ${assignedPicObj?.name}`);
      }
    } catch (err) {
      showNotification('error', 'Gagal memproses tiket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tiket Masuk (Inbound WhatsApp)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pesan pengaduan dari WhatsApp warga diterima admin untuk disepakati kategorinya & diteruskan ke PIC
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'semua'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Semua ({incomingMessages.length})
          </button>
          <button
            onClick={() => setFilterCategory('belum_diproses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterCategory === 'belum_diproses'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Belum Klasifikasi ({incomingMessages.filter(m => !m.isProcessed).length})
          </button>
        </div>
      </div>

      {/* Main Inbox Layout: Master Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Col (4 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm flex flex-col h-[650px]">
          <div className="font-bold text-sm text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span>Daftar Pesan Masuk</span>
            <span className="text-xs text-slate-400 font-normal">Pilih pesan untuk ditinjau</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredMessages.map(msg => {
              const isSelected = msg.id === selectedMsgId;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsgId(msg.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 italic">
                    "{msg.message}"
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                      {msg.suggestedCategory}
                    </span>
                    {msg.isProcessed ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tiket Dibuat
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        ● Belum Diteruskan
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details & Action Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
          {!selectedMsg ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm py-20">
              Pilih pesan WhatsApp dari daftar di sebelah kiri untuk melihat detail.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Message Header Info */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow">
                    {selectedMsg.senderName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {selectedMsg.senderName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{selectedMsg.senderPhone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{selectedMsg.timestamp}</span>
                  {selectedMsg.isProcessed && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-full">
                      Kode Tiket: {selectedMsg.convertedTicketId}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Content Body */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Isi Pesan WhatsApp Pelapor:
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  "{selectedMsg.message}"
                </p>
              </div>

              {/* Frame Kata Matching Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Saran Otomatis (Algoritma Frame Kata Keywords)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Kata kunci ditemukan:{' '}
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {selectedMsg.matchedKeywords.length > 0 ? selectedMsg.matchedKeywords.join(', ') : 'Pengaduan Umum'}
                  </span>
                </p>
              </div>

              {/* Action Form: Confirm Category & Forward to PIC */}
              {selectedMsg.isProcessed ? (
                <div className="p-4 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300/50 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Pesan ini sudah diproses menjadi Tiket.</span>
                    Tiket telah diteruskan ke WhatsApp PIC dan terekam pada file <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-emerald-900 dark:text-emerald-200">ticketing_wa_v2</code>.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDispatchTicket} className="space-y-4 pt-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Disposisi Admin ke WhatsApp PIC:</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Pilih Kategori Disepakati:
                      </label>
                      <select
                        value={targetCategory}
                        onChange={e => setTargetCategory(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name} (SLA: {cat.slaHours}j)
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
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Darurat">Darurat (Segera)</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Rendah">Rendah</option>
                      </select>
                    </div>
                  </div>

                  {/* Automatic PIC Routing Preview */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-xs space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Penerima Disposisi WA PIC (Otomatis):</span>
                      <span className="text-emerald-600 font-extrabold">{assignedPicObj?.name}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Instansi/Biro: {assignedPicObj?.division} | No WA: {assignedPicObj?.phone}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Buat Tiket & Teruskan ke WA Pengampu</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
