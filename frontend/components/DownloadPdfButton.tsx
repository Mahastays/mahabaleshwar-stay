"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfProps {
  bookingId: string;
  checkin: string;
  checkout: string;
  guests: string;
  total: string;
}

export default function DownloadPdfButton({ bookingId, checkin, checkout, guests, total }: PdfProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Rose color
    doc.text("Mahabaleshwar Stay", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Booking Confirmation Receipt", 14, 30);
    
    // Booking Details
    doc.setFontSize(10);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.text(`Booking Reference: ${bookingId}`, 14, 46);
    
    // Table
    autoTable(doc, {
      startY: 55,
      head: [['Description', 'Details']],
      body: [
        ['Check-in Date', checkin],
        ['Check-out Date', checkout],
        ['Guests', decodeURIComponent(guests)],
        ['Location', 'Mahabaleshwar, India'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [225, 29, 72] }
    });
    
    // Pricing
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount Paid: INR ${total}`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing Mahabaleshwar Stay! Have a wonderful trip.", 14, finalY + 30);
    
    doc.save(`Booking_Receipt_${bookingId}.pdf`);
  };

  return (
    <button 
      onClick={generatePDF}
      className="flex items-center justify-center gap-2 w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-brand-red transition-colors shadow-md mt-4 cursor-pointer"
    >
      <Download className="w-5 h-5" />
      Download PDF Receipt
    </button>
  );
}
