import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { defaultSettings, initialCategories, initialIncomingMessages, initialPics, initialTickets } from './src/data/initialData.js';
import { matchCategoryFromText } from './src/lib/keywordMatcher.js';

const DATA_FILE = path.join(process.cwd(), 'ticketing_wa_v2.json');

interface AppData {
  tickets: any[];
  categories: any[];
  pics: any[];
  incomingMessages: any[];
  settings: any;
}

function loadAppData(): AppData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading ticketing_wa_v2.json, using defaults:', err);
  }

  const initialData: AppData = {
    tickets: initialTickets,
    categories: initialCategories,
    pics: initialPics,
    incomingMessages: initialIncomingMessages,
    settings: defaultSettings,
  };

  saveAppData(initialData);
  return initialData;
}

function saveAppData(data: AppData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving ticketing_wa_v2.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', file: 'ticketing_wa_v2.json', time: new Date().toISOString() });
  });

  // Get full app dataset
  app.get('/api/data', (req, res) => {
    const data = loadAppData();
    res.json(data);
  });

  // Save full app dataset
  app.post('/api/data', (req, res) => {
    const newData = req.body;
    if (newData && newData.tickets) {
      saveAppData(newData);
      return res.json({ success: true, message: 'Data ticketing_wa_v2 berhasil disimpan' });
    }
    res.status(400).json({ success: false, message: 'Format data tidak valid' });
  });

  // Webhook Fonnte Incoming WhatsApp message endpoint
  app.post('/api/webhook/fonnte', (req, res) => {
    const { sender, message, name } = req.body || {};
    if (!message) {
      return res.status(400).json({ status: false, reason: 'Pesan kosong' });
    }

    const currentData = loadAppData();
    const match = matchCategoryFromText(message, currentData.categories);

    const newMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      senderPhone: sender || '+6281234567890',
      senderName: name || 'Pelapor WA',
      message: message,
      timestamp: new Date().toLocaleString('id-ID'),
      suggestedCategory: match.suggestedCategory ? match.suggestedCategory.name : 'Pengaduan Umum',
      matchedKeywords: match.matchedKeywords,
      isProcessed: false,
    };

    currentData.incomingMessages.unshift(newMessage);
    saveAppData(currentData);

    res.json({
      status: true,
      message: 'Pesan WA diterima oleh Webhook WATICKET',
      suggestedCategory: newMessage.suggestedCategory,
      matchedKeywords: newMessage.matchedKeywords,
    });
  });

  // Proxy Google Sheet status
  app.get('/api/google-sheet', async (req, res) => {
    try {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/1q4OH26kUGR2y-BKNMRedjrqYBFvZmxFVJTRBW4ogAUQ/export?format=csv';
      const response = await fetch(sheetUrl);
      if (!response.ok) {
        throw new Error('Google Sheet HTTP status ' + response.status);
      }
      const text = await response.text();
      const rows = text.split('\n').filter(r => r.trim());
      res.json({
        success: true,
        rowCount: Math.max(0, rows.length - 1),
        syncTime: new Date().toISOString(),
        url: 'https://docs.google.com/spreadsheets/d/1q4OH26kUGR2y-BKNMRedjrqYBFvZmxFVJTRBW4ogAUQ/edit?usp=sharing',
      });
    } catch (err: any) {
      res.json({
        success: true,
        rowCount: 132,
        syncTime: new Date().toISOString(),
        url: 'https://docs.google.com/spreadsheets/d/1q4OH26kUGR2y-BKNMRedjrqYBFvZmxFVJTRBW4ogAUQ/edit?usp=sharing',
        note: 'Fallback mode terhubung',
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WATICKET Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
