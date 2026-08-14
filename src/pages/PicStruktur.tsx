import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Send,
  MessageSquare,
  Building,
  Phone,
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatWhatsAppPhone, generateWhatsAppLink } from '../lib/fonnteApi';
import { PIC } from '../types';

export const PicStruktur: React.FC = () => {
  const { pics, addPic, updatePic, deletePic, showNotification } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingPicId, setEditingPicId] = useState<string | null>(null);

  // New PIC Form
  const [name, setName] = useState('');
  const [division, setDivision] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Edit PIC Form
  const [editName, setEditName] = useState('');
  const [editDivision, setEditDivision] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addPic({
      name,
      division,
      phone: formatWhatsAppPhone(phone),
      email,
      assignedCategories: [],
      isActive: true,
    });

    showNotification('success', `PIC ${name} berhasil ditambahkan!`);
    setName('');
    setDivision('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  const startEdit = (p: PIC) => {
    setEditingPicId(p.id);
    setEditName(p.name);
    setEditDivision(p.division);
    setEditPhone(p.phone);
    setEditEmail(p.email || '');
  };

  const handleSaveEdit = (picId: string) => {
    updatePic(picId, {
      name: editName,
      division: editDivision,
      phone: formatWhatsAppPhone(editPhone),
      email: editEmail,
    });

    showNotification('success', 'Data PIC diperbarui!');
    setEditingPicId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data WhatsApp PIC & Struktur Biro</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar penanggung jawab bidang/biro penerima disposisi otomatis via WhatsApp
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Batal' : 'Tambah PIC Baru'}</span>
        </button>
      </div>

      {/* Add New PIC Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-md space-y-4"
        >
          <div className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
            Form Tambah PIC Biro / Instansi Pengampu
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap PIC:
              </label>
              <input
                type="text"
                required
                placeholder="Ir. Bambang S."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Biro / Bidang / Instansi:
              </label>
              <input
                type="text"
                required
                placeholder="Biro Infrastruktur & Jaringan"
                value={division}
                onChange={e => setDivision(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp Target:
              </label>
              <input
                type="text"
                required
                placeholder="08123456789"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Opsional:
              </label>
              <input
                type="email"
                placeholder="pic@instansi.go.id"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Simpan PIC
            </button>
          </div>
        </form>
      )}

      {/* PIC Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pics.map(p => {
          const isEditing = editingPicId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Nama PIC:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Divisi/Biro:</label>
                    <input
                      type="text"
                      value={editDivision}
                      onChange={e => setEditDivision(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">No. WhatsApp:</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSaveEdit(p.id)}
                      className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                    <button
                      onClick={() => setEditingPicId(null)}
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">{p.name}</h3>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{p.division}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus PIC ${p.name}?`)) {
                              deletePic(p.id);
                              showNotification('success', 'PIC dihapus');
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp:
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{p.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-600" /> Biro/Bidang:
                        </span>
                        <span className="font-semibold">{p.division}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={generateWhatsAppLink(
                        p.phone,
                        `Halo ${p.name} (${p.division}), tes koneksi integrasi Sistem WATICKET.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tes Pesan WA ke PIC</span>
                    </a>
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
