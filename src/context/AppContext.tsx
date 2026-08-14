import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSettings, initialCategories, initialIncomingMessages, initialPics, initialTickets } from '../data/initialData';
import { formatTicketForPICWA, formatTicketForReporterWA, sendFonnteWhatsApp } from '../lib/fonnteApi';
import { fetchGoogleSheetData } from '../lib/googleSheetSync';
import { matchCategoryFromText } from '../lib/keywordMatcher';
import { AppSettings, Category, IncomingWAMessage, PIC, Ticket, TicketPriority, TicketStatus, User } from '../types';

interface AppContextType {
  currentUser: User | null;
  tickets: Ticket[];
  categories: Category[];
  pics: PIC[];
  incomingMessages: IncomingWAMessage[];
  settings: AppSettings;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  isLoading: boolean;
  syncStatus: { isSyncing: boolean; lastTime: string; message: string; rowsCount: number };
  notification: { id: string; type: 'success' | 'error' | 'info'; message: string } | null;
  login: (username: string, role: 'admin' | 'pic' | 'pelapor') => void;
  logout: () => void;
  toggleTheme: () => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  createTicket: (data: Partial<Ticket>) => Ticket;
  updateTicketStatus: (ticketId: string, status: TicketStatus, note?: string) => void;
  addProgressNote: (ticketId: string, text: string) => void;
  forwardTicketToPIC: (ticketId: string, picId: string) => Promise<boolean>;
  processIncomingMessage: (msgId: string, categoryName: string, priority: TicketPriority) => Promise<Ticket | null>;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addPic: (pic: Omit<PIC, 'id'>) => void;
  updatePic: (id: string, pic: Partial<PIC>) => void;
  deletePic: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  syncGoogleSheetNow: () => Promise<void>;
  simulateIncomingWAMessage: (phone: string, name: string, message: string) => IncomingWAMessage;
  simulateIncomingWhatsApp: (name: string, phone: string, message: string) => IncomingWAMessage;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('waticket_user');
    return saved ? JSON.parse(saved) : { id: 'U-1', name: 'Admin Utama', username: 'admin', role: 'admin', phone: '+6281110002000' };
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('waticket_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('waticket_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [pics, setPics] = useState<PIC[]>(() => {
    const saved = localStorage.getItem('waticket_pics');
    return saved ? JSON.parse(saved) : initialPics;
  });

  const [incomingMessages, setIncomingMessages] = useState<IncomingWAMessage[]>(() => {
    const saved = localStorage.getItem('waticket_messages');
    return saved ? JSON.parse(saved) : initialIncomingMessages;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('waticket_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('waticket_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastTime: new Date().toLocaleTimeString('id-ID'),
    message: 'Google Spreadsheet Terhubung',
    rowsCount: 132,
  });

  const [notification, setNotification] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('waticket_theme', themeMode);
  }, [themeMode]);

  // Persist state to local storage & sync to backend file ticketing_wa_v2.json
  useEffect(() => {
    localStorage.setItem('waticket_tickets', JSON.stringify(tickets));
    localStorage.setItem('waticket_categories', JSON.stringify(categories));
    localStorage.setItem('waticket_pics', JSON.stringify(pics));
    localStorage.setItem('waticket_messages', JSON.stringify(incomingMessages));
    localStorage.setItem('waticket_settings', JSON.stringify(settings));

    // Async sync to server API
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets, categories, pics, incomingMessages, settings }),
    }).catch(() => {});
  }, [tickets, categories, pics, incomingMessages, settings]);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ id: Date.now().toString(), type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const login = (username: string, role: 'admin' | 'pic' | 'pelapor') => {
    const user: User = {
      id: `U-${Date.now().toString().slice(-4)}`,
      name: username === 'admin' ? 'Admin Utama WATICKET' : username,
      username,
      role,
      phone: role === 'admin' ? settings.adminPhone : '+6281234567890',
      division: role === 'admin' ? 'Pusat Komando & Ticketing WA' : 'Dinas Terkait',
    };
    setCurrentUser(user);
    localStorage.setItem('waticket_user', JSON.stringify(user));
    showNotification('success', `Selamat datang, ${user.name} (${user.role.toUpperCase()})`);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('waticket_user');
    showNotification('info', 'Anda telah keluar dari sistem WATICKET.');
  };

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const createTicket = (data: Partial<Ticket>): Ticket => {
    const now = new Date();
    const dateCode = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randNum = Math.floor(Math.random() * 900 + 100);
    const id = `TKT-${dateCode}-${randNum}`;

    const cat = categories.find(c => c.name === data.category) || categories[0];
    const defaultPic = pics.find(p => p.id === cat.defaultPicId) || pics[0];

    const slaHours = cat.slaHours || 24;
    const slaDate = new Date(now.getTime() + slaHours * 3600000);

    const newTicket: Ticket = {
      id,
      reporterName: data.reporterName || 'Pelapor Anonim',
      reporterPhone: data.reporterPhone || '+6281234567890',
      reporterAddress: data.reporterAddress || '-',
      category: cat.name,
      description: data.description || '',
      status: 'Baru',
      priority: data.priority || 'Sedang',
      picId: defaultPic.id,
      picName: `${defaultPic.name} (${defaultPic.division})`,
      picPhone: defaultPic.phone,
      createdAt: now.toLocaleString('id-ID'),
      updatedAt: now.toLocaleString('id-ID'),
      slaDeadline: slaDate.toLocaleString('id-ID'),
      progressPercentage: 0,
      matchedKeywords: data.matchedKeywords || [],
      fonnteStatus: 'Delivered',
      isSyncedGoogleSheet: true,
      notes: [
        {
          id: `N-${Date.now()}`,
          author: currentUser?.name || 'Admin WATICKET',
          text: `Tiket baru dibuat dan dikategorikan ke ${cat.name}. SLA penanganan: ${slaHours} jam.`,
          timestamp: now.toLocaleString('id-ID'),
          isPublic: true,
        },
      ],
      history: [
        { id: `H-${Date.now()}`, status: 'Baru', updatedBy: currentUser?.name || 'Admin WA', timestamp: now.toLocaleString('id-ID') },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    showNotification('success', `Tiket ${newTicket.id} berhasil dibuat.`);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus, note?: string) => {
    const nowStr = new Date().toLocaleString('id-ID');
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updatedNotes = note
            ? [
                ...t.notes,
                {
                  id: `N-${Date.now()}`,
                  author: currentUser?.name || 'Petugas WATICKET',
                  text: note,
                  timestamp: nowStr,
                  isPublic: true,
                },
              ]
            : t.notes;

          const updatedHistory = [
            ...t.history,
            {
              id: `H-${Date.now()}`,
              status,
              updatedBy: currentUser?.name || 'Petugas',
              timestamp: nowStr,
              comment: note,
            },
          ];

          let pct = t.progressPercentage;
          if (status === 'Diproses') pct = 50;
          if (status === 'Selesai') pct = 100;
          if (status === 'Ditutup') pct = 100;

          const updatedTicket = {
            ...t,
            status,
            progressPercentage: pct,
            updatedAt: nowStr,
            notes: updatedNotes,
            history: updatedHistory,
          };

          // Send WA notification to reporter via Fonnte
          const waMessage = formatTicketForReporterWA(updatedTicket, note);
          sendFonnteWhatsApp({
            targetPhone: t.reporterPhone,
            message: waMessage,
            token: settings.fonnteToken,
          });

          return updatedTicket;
        }
        return t;
      })
    );
    showNotification('info', `Status tiket ${ticketId} diperbarui menjadi ${status}`);
  };

  const addProgressNote = (ticketId: string, text: string) => {
    const nowStr = new Date().toLocaleString('id-ID');
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: nowStr,
            notes: [
              ...t.notes,
              {
                id: `N-${Date.now()}`,
                author: currentUser?.name || 'Petugas WA',
                text,
                timestamp: nowStr,
                isPublic: true,
              },
            ],
          };
        }
        return t;
      })
    );
    showNotification('success', 'Catatan progres berhasil ditambahkan');
  };

  const forwardTicketToPIC = async (ticketId: string, picId: string): Promise<boolean> => {
    const targetPic = pics.find(p => p.id === picId);
    if (!targetPic) return false;

    const nowStr = new Date().toLocaleString('id-ID');

    let updatedTicketObj: Ticket | null = null;

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          updatedTicketObj = {
            ...t,
            status: 'Diteruskan' as TicketStatus,
            picId: targetPic.id,
            picName: `${targetPic.name} (${targetPic.division})`,
            picPhone: targetPic.phone,
            updatedAt: nowStr,
            notes: [
              ...t.notes,
              {
                id: `N-${Date.now()}`,
                author: currentUser?.name || 'Admin WA',
                text: `Tiket diteruskan ke PIC WA: ${targetPic.name} (+${targetPic.phone}) - ${targetPic.division}`,
                timestamp: nowStr,
                isPublic: true,
              },
            ],
            history: [
              ...t.history,
              {
                id: `H-${Date.now()}`,
                status: 'Diteruskan',
                updatedBy: currentUser?.name || 'Admin WA',
                timestamp: nowStr,
                comment: `Diteruskan ke ${targetPic.name}`,
              },
            ],
          };
          return updatedTicketObj;
        }
        return t;
      })
    );

    if (updatedTicketObj) {
      const waText = formatTicketForPICWA(updatedTicketObj);
      const result = await sendFonnteWhatsApp({
        targetPhone: targetPic.phone,
        message: waText,
        token: settings.fonnteToken,
      });

      showNotification(result.success ? 'success' : 'info', `Tiket diteruskan ke WhatsApp ${targetPic.name}`);
      return true;
    }
    return false;
  };

  const processIncomingMessage = async (msgId: string, categoryName: string, priority: TicketPriority): Promise<Ticket | null> => {
    const msg = incomingMessages.find(m => m.id === msgId);
    if (!msg) return null;

    const matchedCat = categories.find(c => c.name === categoryName) || categories[0];
    const defaultPic = pics.find(p => p.id === matchedCat.defaultPicId) || pics[0];

    const newTicket = createTicket({
      reporterName: msg.senderName,
      reporterPhone: msg.senderPhone,
      category: matchedCat.name,
      description: msg.message,
      priority,
      matchedKeywords: msg.matchedKeywords,
    });

    // Mark message as processed
    setIncomingMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isProcessed: true, convertedTicketId: newTicket.id } : m))
    );

    // Auto forward to PIC WA
    await forwardTicketToPIC(newTicket.id, defaultPic.id);

    return newTicket;
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `CAT-${Date.now().toString().slice(-4)}`,
    };
    setCategories(prev => [...prev, newCat]);
    showNotification('success', `Kategori ${newCat.name} berhasil ditambahkan`);
  };

  const updateCategory = (id: string, catData: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...catData } : c)));
    showNotification('info', 'Data kategori berhasil diperbarui');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showNotification('info', 'Kategori berhasil dihapus');
  };

  const addPic = (picData: Omit<PIC, 'id'>) => {
    const newPic: PIC = {
      ...picData,
      id: `PIC-${Date.now().toString().slice(-4)}`,
    };
    setPics(prev => [...prev, newPic]);
    showNotification('success', `PIC ${newPic.name} berhasil ditambahkan`);
  };

  const updatePic = (id: string, picData: Partial<PIC>) => {
    setPics(prev => prev.map(p => (p.id === id ? { ...p, ...picData } : p)));
    showNotification('info', 'Data PIC berhasil diperbarui');
  };

  const deletePic = (id: string) => {
    setPics(prev => prev.filter(p => p.id !== id));
    showNotification('info', 'PIC berhasil dihapus');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showNotification('success', 'Pengaturan sistem WATICKET disimpan.');
  };

  const syncGoogleSheetNow = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    const result = await fetchGoogleSheetData(settings.googleSheetId);
    setSyncStatus({
      isSyncing: false,
      lastTime: new Date().toLocaleTimeString('id-ID'),
      message: result.message,
      rowsCount: result.rowsCount || 132,
    });
    setSettings(prev => ({ ...prev, lastSyncTime: new Date().toISOString() }));
    showNotification('success', 'Sinkronisasi Google Spreadsheet Berhasil!');
  };

  const simulateIncomingWAMessage = (phone: string, name: string, messageText: string): IncomingWAMessage => {
    const match = matchCategoryFromText(messageText, categories);
    const newMsg: IncomingWAMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      senderPhone: phone || '+6281234567890',
      senderName: name || 'Pelapor Baru',
      message: messageText,
      timestamp: new Date().toLocaleString('id-ID'),
      suggestedCategory: match.suggestedCategory ? match.suggestedCategory.name : 'Pengaduan Umum',
      matchedKeywords: match.matchedKeywords,
      isProcessed: false,
    };

    setIncomingMessages(prev => [newMsg, ...prev]);
    showNotification('info', `Pesan WA baru diterima dari ${name}: "${match.suggestedCategory?.name || 'General'}"`);
    return newMsg;
  };

  const simulateIncomingWhatsApp = (name: string, phone: string, messageText: string): IncomingWAMessage => {
    return simulateIncomingWAMessage(phone, name, messageText);
  };

  const resetAllData = () => {
    setTickets(initialTickets);
    setCategories(initialCategories);
    setPics(initialPics);
    setIncomingMessages(initialIncomingMessages);
    setSettings(defaultSettings);
    localStorage.clear();
    showNotification('info', 'Seluruh rekaman data ticketing_wa_v2 dikembalikan ke awal.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tickets,
        categories,
        pics,
        incomingMessages,
        settings,
        themeMode,
        setThemeMode,
        isLoading,
        syncStatus,
        notification,
        login,
        logout,
        toggleTheme,
        showNotification,
        createTicket,
        updateTicketStatus,
        addProgressNote,
        forwardTicketToPIC,
        processIncomingMessage,
        addCategory,
        updateCategory,
        deleteCategory,
        addPic,
        updatePic,
        deletePic,
        updateSettings,
        syncGoogleSheetNow,
        simulateIncomingWAMessage,
        simulateIncomingWhatsApp,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
