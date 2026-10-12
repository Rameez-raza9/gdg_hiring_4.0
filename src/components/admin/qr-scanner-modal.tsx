"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CheckCircle2,
  Clock,
  FlipHorizontal,
  Keyboard,
  Loader2,
  Maximize2,
  RefreshCw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { playDuplicateTone, playErrorTone, playSuccessChime } from "@/lib/audio-effects";
import { formatToIST } from "@/lib/admin-data";

export interface ScannedAttendee {
  id?: number;
  application_id?: string;
  student_name: string;
  roll_number: string;
  branch: string;
  section: string;
  status: "Present" | "Absent";
  marked_at: string;
  alreadyPresent?: boolean;
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  onAttendeeMarked?: (attendee: ScannedAttendee) => void;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  eventId = "EV-RECRUIT",
  onAttendeeMarked,
}: QRScannerModalProps) {
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Manual roll/text input (e.g. from handheld barcode gun or typing)
  const [manualText, setManualText] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Latest scanned result alert
  const [lastScanned, setLastScanned] = useState<ScannedAttendee | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScannedAttendee[]>([]);

  // Scanner ref
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isCooldownRef = useRef(false);
  const lastScannedTextRef = useRef<string>("");
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processScanText = useCallback(
    async (decodedText: string) => {
      const trimmed = decodedText.trim();
      if (!trimmed) return;

      // De-duplicate fast repeated scans of the exact same code within 3 seconds
      if (isCooldownRef.current && lastScannedTextRef.current === trimmed) {
        return;
      }

      isCooldownRef.current = true;
      lastScannedTextRef.current = trimmed;
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        isCooldownRef.current = false;
        lastScannedTextRef.current = "";
      }, 2500);

      try {
        setErrorMessage(null);
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            action: "scan",
            text: trimmed,
          }),
        });

        const data = await res.json();

        if (res.ok && data.matched && data.attendee) {
          const attendee: ScannedAttendee = {
            ...data.attendee,
            alreadyPresent: data.alreadyPresent,
          };

          setLastScanned(attendee);
          setScanHistory((prev) => [attendee, ...prev.filter((p) => p.roll_number !== attendee.roll_number)].slice(0, 8));

          if (soundEnabled) {
            if (attendee.alreadyPresent) {
              playDuplicateTone();
            } else {
              playSuccessChime();
            }
          }

          if (onAttendeeMarked) {
            onAttendeeMarked(attendee);
          }
        } else {
          setErrorMessage(data.error || `No candidate found matching: "${trimmed}"`);
          if (soundEnabled) playErrorTone();
        }
      } catch (err: unknown) {
        console.error("Scan error:", err);
        setErrorMessage("Network error occurred while submitting scan.");
        if (soundEnabled) playErrorTone();
      }
    },
    [eventId, onAttendeeMarked, soundEnabled]
  );

  const startScanner = useCallback(
    async (cameraId?: string) => {
      try {
        setCameraError(null);

        // Ensure container exists
        const container = document.getElementById("qr-reader");
        if (!container) return;

        if (html5QrCodeRef.current) {
          try {
            await html5QrCodeRef.current.stop();
          } catch {
            // ignore if not running
          }
        }

        const scanner = new Html5Qrcode("qr-reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
          ],
          verbose: false,
        });
        html5QrCodeRef.current = scanner;

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        };

        const targetCamera = cameraId || (cameras.length > 0 ? cameras[0].id : { facingMode: "environment" });

        await scanner.start(
          targetCamera,
          config,
          (decodedText) => {
            processScanText(decodedText);
          },
          () => {
            // Scan frame failure (normal during continuous video)
          }
        );

        setIsScanning(true);
      } catch (err: unknown) {
        console.error("Failed to start scanner:", err);
        setCameraError("Camera permission was denied or camera is unavailable. You can use manual entry below.");
        setIsScanning(false);
      }
    },
    [cameras, processScanText]
  );

  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Initialize camera devices
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera if available
          const backCam = devices.find(
            (c) => c.label.toLowerCase().includes("back") || c.label.toLowerCase().includes("environment")
          );
          const chosen = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(chosen);
          startScanner(chosen);
        } else {
          startScanner();
        }
      })
      .catch((err) => {
        console.warn("Could not enumerate cameras:", err);
        startScanner();
      });

    return () => {
      stopScanner();
    };
  }, [isOpen, startScanner, stopScanner]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || manualLoading) return;
    setManualLoading(true);
    await processScanText(manualText.trim());
    setManualText("");
    setManualLoading(false);
  };

  const switchCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamId = cameras[nextIndex].id;
    setSelectedCameraId(nextCamId);
    startScanner(nextCamId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#0B0F19] text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0F172A]/70">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4285F4] to-[#34A853] text-white shadow-lg shadow-blue-500/20">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Fast QR Scanner</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Scan candidate QR code to mark Present in real-time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
              title={soundEnabled ? "Mute chimes" : "Enable chimes"}
            >
              {soundEnabled ? <Volume2 className="size-4 text-emerald-400" /> : <VolumeX className="size-4 text-slate-400" />}
            </button>

            {cameras.length > 1 && (
              <button
                onClick={switchCamera}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                title="Switch Camera"
              >
                <FlipHorizontal className="size-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Camera Viewfinder */}
          <div className="relative mx-auto aspect-square w-full max-w-[340px] rounded-3xl overflow-hidden border-2 border-white/15 bg-black/60 shadow-inner flex items-center justify-center">
            <div id="qr-reader" className="w-full h-full object-cover" />

            {/* Target Reticle Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative size-56 rounded-2xl border-2 border-dashed border-[#4285F4]/80 shadow-[0_0_20px_rgba(66,133,244,0.3)] flex items-center justify-center">
                {/* Laser scan line animation */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#34A853] to-transparent animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_12px_#34A853]" />

                {/* Corner Accents */}
                <span className="absolute -top-1 -left-1 size-4 border-t-2 border-l-2 border-[#4285F4]" />
                <span className="absolute -top-1 -right-1 size-4 border-t-2 border-r-2 border-[#4285F4]" />
                <span className="absolute -bottom-1 -left-1 size-4 border-b-2 border-l-2 border-[#4285F4]" />
                <span className="absolute -bottom-1 -right-1 size-4 border-b-2 border-r-2 border-[#4285F4]" />
              </div>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center">
                <Camera className="size-10 text-rose-400 mb-2 opacity-80" />
                <p className="text-xs text-rose-300 mb-3">{cameraError}</p>
                <button
                  onClick={() => startScanner(selectedCameraId)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition"
                >
                  <RefreshCw className="size-3.5" /> Retry Camera
                </button>
              </div>
            )}
          </div>

          {/* Quick Result Announcement Card */}
          {lastScanned && (
            <div
              className={`rounded-2xl border p-4 transition-all duration-300 animate-in slide-in-from-top-2 ${
                lastScanned.alreadyPresent
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      lastScanned.alreadyPresent ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{lastScanned.student_name}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-semibold text-white bg-white/10 px-1.5 py-0.5 rounded">
                        {lastScanned.roll_number}
                      </span>
                      <span>{lastScanned.branch} • Sec {lastScanned.section}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      lastScanned.alreadyPresent
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {lastScanned.alreadyPresent ? "Already Present" : "Marked Present ✓"}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="size-3" /> {formatToIST(lastScanned.marked_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-center gap-2.5 animate-in fade-in">
              <XCircle className="size-5 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Direct Manual Entry / Barcode Gun Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Keyboard className="size-3.5 text-[#4285F4]" /> USB Scanner or Manual Roll Number
              </span>
              <span className="text-[10px] text-slate-500">Press Enter to mark</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="e.g. 24A81A05U3 or A-5361"
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#4285F4] focus:outline-none focus:ring-1 focus:ring-[#4285F4]"
                />
              </div>
              <button
                type="submit"
                disabled={manualLoading || !manualText.trim()}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#4285F4] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-[#3367D6] disabled:opacity-50 transition cursor-pointer"
              >
                {manualLoading ? <Loader2 className="size-4 animate-spin" /> : "Mark"}
              </button>
            </div>
          </form>

          {/* Session Scan History */}
          {scanHistory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Recent check-ins in this session ({scanHistory.length})</span>
                <span className="text-[10px] text-emerald-400 font-medium">Auto-synced to TV</span>
              </div>
              <div className="divide-y divide-white/5 max-h-44 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                {scanHistory.map((item, idx) => (
                  <div key={`${item.roll_number}-${idx}`} className="flex items-center justify-between px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300 font-medium">{item.roll_number}</span>
                      <span className="text-white font-medium truncate max-w-[150px]">{item.student_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span>{item.branch}</span>
                      <span className="text-emerald-400 font-semibold">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
