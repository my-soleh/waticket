import { Ticket } from '../types';

export interface FonnteSendOptions {
  targetPhone: string;
  message: string;
  token?: string;
}

export function formatWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const formattedPhone = formatWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

export function formatTicketForPICWA(ticket: Ticket): string {
  return `*TICKET DISPOSISI [WATICKET]*
----------------------------------
*Kode Tiket:* ${ticket.id}
*Pelapor:* ${ticket.reporterName} (${ticket.reporterPhone})
*Kategori:* ${ticket.category}
*Prioritas:* ${ticket.priority}
*SLA Target:* ${ticket.slaDeadline}

*Uraian Kendala/Pengaduan:*
"${ticket.description}"

*Alamat/Lokasi:* ${ticket.reporterAddress || '-'}

Yth. *${ticket.picName}*,
Laporan di atas telah diteruskan dari Admin WATICKET. Mohon untuk segera menindaklanjuti dan mengupdate status pengerjaan pada sistem.

Terima kasih.`;
}

export function formatTicketForReporterWA(ticket: Ticket, customNote?: string): string {
  return `*UPDATE STATUS TIKET PENGADUAN [WATICKET]*
----------------------------------
Halo Bpk/Ibu *${ticket.reporterName}*,

Laporan Anda dengan kode: *${ticket.id}*
Kategori: *${ticket.category}*

Saat ini berstatus: *${ticket.status.toUpperCase()}*
Progres: *${ticket.progressPercentage}%*
Ditangani Oleh: *${ticket.picName}*

${customNote ? `*Catatan Petugas:*
"${customNote}"` : ''}

Terima kasih telah menyampaikan laporan melalui layanan pengaduan WATICKET.`;
}

export async function sendFonnteWhatsApp(options: FonnteSendOptions): Promise<{ success: boolean; responseMessage: string }> {
  const target = formatWhatsAppPhone(options.targetPhone);
  const token = options.token || 'fonnte_demo_token';

  try {
    // If running in development with demo token, simulate success
    if (token.includes('demo') || !token) {
      console.log('[Fonnte Sim] Sending WA to', target, 'Message:', options.message);
      return {
        success: true,
        responseMessage: `[SIMULASI OK] Pesan terkirim via Fonnte API ke +${target}`,
      };
    }

    const formData = new FormData();
    formData.append('target', target);
    formData.append('message', options.message);

    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.status) {
      return { success: true, responseMessage: 'Pesan berhasil terkirim via Fonnte WA API' };
    } else {
      return { success: false, responseMessage: data.reason || 'Gagal mengirim via Fonnte' };
    }
  } catch (err: any) {
    return { success: false, responseMessage: `Error Fonnte API: ${err?.message || 'Network Error'}` };
  }
}
