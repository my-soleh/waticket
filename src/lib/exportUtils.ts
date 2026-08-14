import { Document, AlignmentType, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, Header, Footer } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Ticket } from '../types';

export function exportTicketsToXLSX(tickets: Ticket[], filename = 'Laporan_Ticketing_WATICKET.xlsx') {
  const data = tickets.map((t, index) => ({
    No: index + 1,
    'Kode Tiket': t.id,
    'Tanggal Lapor': t.createdAt,
    'Nama Pelapor': t.reporterName,
    'No WhatsApp Pelapor': t.reporterPhone,
    Alamat: t.reporterAddress || '-',
    Kategori: t.category,
    'Rincian Laporan': t.description,
    'PIC / Unit Kerja': t.picName,
    'No WA PIC': t.picPhone,
    Status: t.status,
    Prioritas: t.priority,
    'SLA Target': t.slaDeadline,
    'Progres (%)': `${t.progressPercentage}%`,
    'Terakhir Diupdate': t.updatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 18 }, // Kode Tiket
    { wch: 18 }, // Tanggal
    { wch: 22 }, // Nama
    { wch: 18 }, // Phone
    { wch: 25 }, // Alamat
    { wch: 22 }, // Kategori
    { wch: 40 }, // Rincian
    { wch: 28 }, // PIC
    { wch: 18 }, // PIC Phone
    { wch: 14 }, // Status
    { wch: 12 }, // Prioritas
    { wch: 18 }, // SLA
    { wch: 12 }, // Progres
    { wch: 18 }, // Updated
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekaman Tiket WA');
  XLSX.writeFile(workbook, filename);
}

export function exportTicketsToPDF(tickets: Ticket[], filename = 'Laporan_Ticketing_WATICKET.pdf') {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Title Header
  doc.setFontSize(18);
  doc.setTextColor(0, 104, 55); // Emerald NFIS Green
  doc.text('WATICKET - LAPORAN TICKETING & LAYANAN PENGADUAN WHATSAPP', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Dicetak Pada: ${new Date().toLocaleString('id-ID')} | Total Rekaman: ${tickets.length} Tiket`, 14, 22);

  // Summary Metrics
  const total = tickets.length;
  const selesai = tickets.filter(t => t.status === 'Selesai').length;
  const diproses = tickets.filter(t => t.status === 'Diproses').length;
  const diteruskan = tickets.filter(t => t.status === 'Diteruskan' || t.status === 'Baru').length;

  doc.setFillColor(240, 249, 245);
  doc.rect(14, 26, 269, 12, 'F');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Ringkasan: Total (${total}) | Diteruskan/Baru (${diteruskan}) | Diproses (${diproses}) | Selesai (${selesai})`, 18, 33);

  // Table Columns
  const tableColumn = [
    'No',
    'Kode Tiket',
    'Tanggal',
    'Pelapor',
    'Kategori',
    'Pengaduan',
    'PIC / Biro',
    'Status',
    'Prioritas',
    'Progres',
  ];

  const tableRows = tickets.map((t, index) => [
    index + 1,
    t.id,
    t.createdAt,
    `${t.reporterName}\n(${t.reporterPhone})`,
    t.category,
    t.description.length > 60 ? t.description.substring(0, 57) + '...' : t.description,
    t.picName,
    t.status,
    t.priority,
    `${t.progressPercentage}%`,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 42,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 104, 55],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 28 },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 32 },
      5: { cellWidth: 60 },
      6: { cellWidth: 38 },
      7: { cellWidth: 22 },
      8: { cellWidth: 20 },
      9: { cellWidth: 18 },
    },
  });

  doc.save(filename);
}

export async function exportTicketsToDOCX(tickets: Ticket[], filename = 'Laporan_Ticketing_WATICKET.docx') {
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ children: [new Paragraph({ text: 'No', style: 'headerStyle' })], width: { size: 5, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Kode Tiket', style: 'headerStyle' })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Tanggal', style: 'headerStyle' })], width: { size: 12, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Pelapor', style: 'headerStyle' })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Kategori', style: 'headerStyle' })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Detail Pengaduan', style: 'headerStyle' })], width: { size: 23, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'PIC', style: 'headerStyle' })], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [new Paragraph({ text: 'Status', style: 'headerStyle' })], width: { size: 10, type: WidthType.PERCENTAGE } }),
      ],
    }),
    ...tickets.map((t, i) => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(String(i + 1))] }),
        new TableCell({ children: [new Paragraph(t.id)] }),
        new TableCell({ children: [new Paragraph(t.createdAt)] }),
        new TableCell({ children: [new Paragraph(`${t.reporterName}\n${t.reporterPhone}`)] }),
        new TableCell({ children: [new Paragraph(t.category)] }),
        new TableCell({ children: [new Paragraph(t.description)] }),
        new TableCell({ children: [new Paragraph(t.picName)] }),
        new TableCell({ children: [new Paragraph(t.status)] }),
      ],
    })),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [new Paragraph({ text: 'WATICKET - Sistem Layanan Pengaduan WhatsApp', alignment: AlignmentType.RIGHT })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({ text: 'Rekaman Data File: ticketing_wa_v2', alignment: AlignmentType.CENTER })],
          }),
        },
        children: [
          new Paragraph({
            text: 'LAPORAN REKAMAN TIKET & PENGADUAN WHATSAPP',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n`, bold: true }),
              new TextRun({ text: `Total Tiket Ditampilkan: ${tickets.length}\n\n` }),
            ],
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const blob = await saveAs(await import('docx').then(m => m.Packer.toBlob(doc)), filename);
  return blob;
}
