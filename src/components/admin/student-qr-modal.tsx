"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, X, Sparkles } from "lucide-react";
import { G } from "@/lib/brand";

interface StudentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    student_name: string;
    roll_number: string;
    branch: string;
    section: string;
    application_id?: string;
  } | null;
}

export default function StudentQRModal({ isOpen, onClose, student }: StudentQRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!student || !isOpen) return;

    // Encode candidate's roll number as primary identifier
    const payload = student.roll_number.trim().toUpperCase();

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR:", err));
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `GDG_QR_${student.roll_number}.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X className="size-4" />
        </button>

        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-[#4285F4]">
          <Sparkles className="size-3.5" /> GDG SVEC 4.0 Pass
        </div>

        <h3 className="text-xl font-bold text-foreground">{student.student_name}</h3>
        <p className="mt-1 font-mono text-sm font-semibold text-[#4285F4]">{student.roll_number}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {student.branch} • Section {student.section}
        </p>

        {/* QR Code Container */}
        <div className="my-6 mx-auto flex items-center justify-center rounded-2xl bg-white p-4 shadow-lg border border-slate-200 max-w-[240px] aspect-square">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR Code for ${student.roll_number}`} className="size-full object-contain" />
          ) : (
            <div className="size-48 flex items-center justify-center text-xs text-slate-400">
              Generating QR...
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground mb-5">
          Point any smartphone or GDG QR scanner at this code to verify attendance instantly.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4285F4] py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#3367D6] transition cursor-pointer"
          >
            <Download className="size-3.5" /> Download
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/60 hover:bg-secondary px-4 py-2.5 text-xs font-medium text-foreground transition cursor-pointer"
          >
            <Printer className="size-3.5" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
