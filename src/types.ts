export type TicketStatus = 'Baru' | 'Diteruskan' | 'Diproses' | 'Menunggu' | 'Selesai' | 'Ditutup' | 'Terlambat SLA';

export type TicketPriority = 'Tinggi' | 'Sedang' | 'Rendah' | 'Darurat';

export type UserRole = 'admin' | 'pic' | 'pelapor';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  phone: string;
  division?: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  keywords: string[]; // Frame kata
  defaultPicId: string;
  defaultPicName: string;
  defaultPicPhone: string;
  slaHours: number;
  iconName: string;
  badgeColor: string;
}

export interface PIC {
  id: string;
  name: string;
  phone: string;
  division: string;
  roleTitle: string;
  email: string;
  isActive: boolean;
  assignedCategories: string[];
}

export interface ProgressNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isPublic: boolean;
  attachmentUrl?: string;
}

export interface TicketHistory {
  id: string;
  status: TicketStatus;
  updatedBy: string;
  timestamp: string;
  comment?: string;
}

export interface Ticket {
  id: string;
  reporterName: string;
  reporterPhone: string;
  reporterAddress?: string;
  category: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  picId: string;
  picName: string;
  picPhone: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  progressPercentage: number;
  notes: ProgressNote[];
  history: TicketHistory[];
  matchedKeywords: string[];
  fonnteStatus: 'Delivered' | 'Failed' | 'Pending' | 'Not Sent';
  isSyncedGoogleSheet: boolean;
}

export interface IncomingWAMessage {
  id: string;
  senderPhone: string;
  senderName: string;
  message: string;
  timestamp: string;
  suggestedCategory: string;
  matchedKeywords: string[];
  isProcessed: boolean;
  convertedTicketId?: string;
}

export interface AppSettings {
  appName: string;
  appSubtitle: string;
  adminPhone: string;
  adminName: string;
  fonnteToken: string;
  fonnteDevice: string;
  fonnteAutoForward: boolean;
  googleSheetUrl: string;
  googleSheetId: string;
  googleSheetAutoSync: boolean;
  lastSyncTime: string;
  logoUrl: string;
  bgLoginUrl: string;
  themeMode: 'light' | 'dark';
}
