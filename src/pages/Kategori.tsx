import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export const Kategori: React.FC = () => {
  const { categories, pics, addCategory, updateCategory, deleteCategory, showNotification } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // New Category Form State
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [defaultPicId, setDefaultPicId] = useState(pics[0]?.id || '');
  const [slaHours, setSlaHours] = useState(24);
  const [color, setColor] = useState('#25D366');

  // Edit State
  const [editName, setEditName] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editPicId, setEditPicId] = useState('');
  const [editSlaHours, setEditSlaHours] = useState(24);

  const resetForm = () => {
    setName('');
    setKeywords('');
    setDefaultPicId(pics[0]?.id || '');
    setSlaHours(24);
    setIsAdding(false);
    setEditingCatId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const kwArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    addCategory({
      name,
      keywords: kwArray,
      defaultPicId,
      slaHours: Number(slaHours),
      color: '#25D366',
    });

    showNotification('success', `Kategori ${name} berhasil ditambahkan!`);
    resetForm();
  };

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditKeywords(cat.keywords.join(', '));
    setEditPicId(cat.defaultPicId);
    setEditSlaHours(cat.slaHours);
  };

  const handleSaveEdit = (catId: string) => {
    const kwArray = editKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    updateCategory(catId, {
      name: editName,
      keywords: kwArray,
      defaultPicId: editPicId,
      slaHours: Number(editSlaHours),
    });

    showNotification('success', 'Kategori diperbarui!');
    setEditingCatId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kelola Kategori & Filter Frame Kata
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Konfigurasi kata kunci otomatis pengenal pesan WA warga & pemetaan PIC Biro/Instansi pengampu
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Tambah Kategori Baru'}</span>
        </button>
      </div>

      {/* Add New Category Form (Collapsible) */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-md space-y-4"
        >
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Form Tambah Kategori & Keywords Frame Kata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kategori:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Lampu Jalan Padam"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kata Kunci / Frame Kata (pisahkan koma):
              </label>
              <input
                type="text"
                required
                placeholder="lampu, pju, gelap, jalanan"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PIC Penanggung Jawab Default:
              </label>
              <select
                value={defaultPicId}
                onChange={e => setDefaultPicId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                {pics.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.division})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target SLA (Jam):
              </label>
              <input
                type="number"
                min={1}
                max={168}
                value={slaHours}
                onChange={e => setSlaHours(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Simpan Kategori Baru
            </button>
          </div>
        </form>
      )}

      {/* Category List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const pic = pics.find(p => p.id === cat.defaultPicId) || pics[0];
          const isEditing = editingCatId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama Kategori:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Keywords (Koma):</label>
                    <input
                      type="text"
                      value={editKeywords}
                      onChange={e => setEditKeywords(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">PIC Default:</label>
                      <select
                        value={editPicId}
                        onChange={e => setEditPicId(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                      >
                        {pics.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">SLA (Jam):</label>
                      <input
                        type="number"
                        value={editSlaHours}
                        onChange={e => setEditSlaHours(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color || '#25D366' }}
                        />
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{cat.name}</h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kategori ${cat.name}?`)) {
                              deleteCategory(cat.id);
                              showNotification('success', 'Kategori dihapus');
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Frame Kata Keywords Pill Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Kata Kunci Filter:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded-full text-[11px] font-medium"
                          >
                            [{kw}]
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* PIC & SLA Info */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" /> PIC Pengampu:
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{pic?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> SLA Penanganan:
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{cat.slaHours} Jam</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
