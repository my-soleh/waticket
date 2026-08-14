import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SimulasiWA: React.FC = () => {
  const { categories, simulateIncomingWhatsApp, processIncomingMessage, showNotification } = useApp();

  const [senderName, setSenderName] = useState('Drs. Ahmad Dahlan');
  const [senderPhone, setSenderPhone] = useState('081298765432');
  const [message, setMessage] = useState(
    'Halo admin, mohon bantuan perbaikan pju mati di jalan pemuda no 45. Jalanan jadi sangat gelap dan rawan kejahatan di malam hari.'
  );

  const [simulatedMsg, setSimulatedMsg] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = simulateIncomingWhatsApp(senderName, senderPhone, message);
    setSimulatedMsg(newMsg);
    showNotification('info', 'Pesan simulasi WhatsApp warga diterima!');
  };

  const handleDirectProcess = async () => {
    if (!simulatedMsg) return;
    setIsProcessing(true);

    try {
      const ticket = await processIncomingMessage(
        simulatedMsg.id,
        simulatedMsg.suggestedCategory,
        'Tinggi'
      );

      if (ticket) {
        showNotification('success', `Tiket ${ticket.id} berhasil diproses & diteruskan ke PIC!`);
        // Refresh simulation state
        setSimulatedMsg((prev: any) => ({ ...prev, isProcessed: true, convertedTicketId: ticket.id }));
      }
    } catch (err) {
      showNotification('error', 'Gagal memproses tiket');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadExamplePreset = (presetText: string) => {
    setMessage(presetText);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Simulasi Pesan Masuk WhatsApp Warga</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji coba algoritma Frame Kata & webhook Fonnte dalam mengenali kata kunci aduan secara otomatis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-5">
          <div className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>Kirim Simulasi Pesan WhatsApp</span>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase">Preset Aduan Masyarakat:</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  loadExamplePreset(
                    'Mohon info cara mengurus KTP elektronik rusak di kantor kecamatan, syaratnya apa saja ya pak?'
                  )
                }
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                [Informasi KTP]
              </button>
              <button
                type="button"
                onClick={() =>
                  loadExamplePreset(
                    'Lapor min, ada genangan air tinggi karena selokan tumpat di jalan merdeka no 12 setelah hujan deras.'
                  )
                }
                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                [Drainase / Banjir]
              </button>
              <button
                type="button"
                onClick={() =>
                  loadExamplePreset(
                    'Tolong tumpukan sampah di pinggir pasar belum diangkut sudah 3 hari baunya sangat mengganggu warga.'
                  )
                }
                className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                [Penanganan Sampah]
              </button>
            </div>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Warga Pelapor:
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp Warga:
                </label>
                <input
                  type="text"
                  required
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pesan Teks WhatsApp (Aduan / Laporan Warga):
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Kirim & Jalankan Analisis Frame Kata</span>
            </button>
          </form>
        </div>

        {/* Live Analysis Output Box (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Hasil Analisis Keyword Frame Kata</span>
            </span>
            {simulatedMsg && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Status: {simulatedMsg.isProcessed ? 'Tiket Dibuat' : 'Siap Disposisi'}
              </span>
            )}
          </div>

          {!simulatedMsg ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Silahkan kirim pesan simulasi di sebelah kiri untuk melihat proses pencocokan kategori otomatis.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {simulatedMsg.senderName} ({simulatedMsg.senderPhone})
                  </span>
                  <span className="text-[10px] text-slate-400">{simulatedMsg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{simulatedMsg.message}"
                </p>
              </div>

              {/* Matched Keywords Box */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Kategori Terdeteksi Otomatis:
                </div>
                <div className="inline-block px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-sm">
                  {simulatedMsg.suggestedCategory}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  Kata Kunci Yang Cocok:{' '}
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {simulatedMsg.matchedKeywords.length > 0
                      ? simulatedMsg.matchedKeywords.join(', ')
                      : 'Pengaduan Umum (Default)'}
                  </span>
                </div>
              </div>

              {/* Convert to Ticket Button */}
              {!simulatedMsg.isProcessed ? (
                <button
                  onClick={handleDirectProcess}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Memproses...' : 'Proses Menjadi Tiket & Teruskan ke WA PIC'}</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    Berhasil Dikonversi Menjadi Tiket ID: {simulatedMsg.convertedTicketId}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
