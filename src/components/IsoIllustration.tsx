"use client";

import { motion } from "framer-motion";
import { Check, Calendar, BarChart2, MessageSquare, Compass, Bell, User, Layers } from "lucide-react";

export default function IsoIllustration() {
  return (
    <div className="relative w-full h-[540px] flex items-center justify-center select-none overflow-visible">
      {/* Subtle isometric projection container */}
      <div
        className="relative w-[340px] h-[480px] transition-transform duration-700 ease-out hover:scale-105"
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Isometric base coordinate system */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "rotateX(55deg) rotateZ(-35deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle guide lines */}
          <svg
            className="absolute -inset-24 w-[520px] h-[640px] pointer-events-none opacity-40 overflow-visible"
            style={{ transform: "translateZ(-10px)" }}
          >
            <line x1="120" y1="80" x2="380" y2="80" stroke="#E2E2E2" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1="260" x2="420" y2="260" stroke="#E2E2E2" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="100" y1="460" x2="380" y2="460" stroke="#E2E2E2" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="160" y1="40" x2="160" y2="520" stroke="#E2E2E2" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="320" y1="40" x2="320" y2="520" stroke="#E2E2E2" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Central Main Phone Outline Slab */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[280px] h-[460px] rounded-[38px] border border-[#E0E0E0] bg-white/70 backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.06)] p-3 flex flex-col justify-between"
            style={{ transform: "translateZ(0px)" }}
          >
            {/* Phone notch */}
            <div className="mx-auto h-3 w-16 rounded-full bg-[#E5E5E5] mb-2" />

            {/* Inner phone ghost screen elements */}
            <div className="flex-1 flex flex-col gap-3 px-2 pt-2 opacity-50">
              <div className="h-3 w-20 rounded bg-[#EAEAEA]" />
              <div className="h-20 w-full rounded-xl border border-dashed border-[#E2E2E2] bg-white/40" />
              <div className="h-16 w-full rounded-xl border border-dashed border-[#E2E2E2] bg-white/40" />
            </div>

            {/* Dock inside phone */}
            <div className="h-10 w-full rounded-2xl bg-white/90 border border-[#E8E8E8] flex items-center justify-around px-3 shadow-sm">
              <Compass size={14} className="text-[#888888]" />
              <Layers size={14} className="text-[#888888]" />
              <Bell size={14} className="text-[#888888]" />
              <User size={14} className="text-[#888888]" />
            </div>
          </motion.div>

          {/* Card A: Chat Card (Top-Right layer) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute -right-12 top-6 w-[200px] rounded-[14px] border border-[#E0E0E0] bg-white/95 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.06)] backdrop-blur-sm"
            style={{ transform: "translateZ(65px)" }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span className="text-[11px] font-semibold text-[#0A0A0A]">SVEC Chat</span>
              </div>
              <span className="rounded-full bg-[#F4F4F4] px-1.5 py-0.5 text-[9px] font-medium text-[#666666]">
                42
              </span>
            </div>

            <div className="mt-2.5 flex flex-col gap-2">
              {/* Skeleton bubble gray */}
              <div className="self-start rounded-lg bg-[#F5F5F5] px-2.5 py-1.5 max-w-[85%]">
                <div className="h-1.5 w-16 rounded bg-[#D4D4D4]" />
              </div>

              {/* Tinted green message bubble */}
              <div
                className="self-end rounded-lg px-2.5 py-1.5 max-w-[85%] border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 18%, white)",
                  borderColor: "var(--accent-border)",
                }}
              >
                <div className="h-1.5 w-20 rounded bg-[#0A0A0A]/80 mb-1" />
                <div className="h-1.5 w-12 rounded bg-[#0A0A0A]/60" />
              </div>

              {/* Input placeholder */}
              <div className="mt-1 flex items-center justify-between rounded-md border border-[#EBEBEB] bg-[#FAFAFA] px-2 py-1">
                <span className="text-[9px] text-[#A0A0A0]">Message…</span>
                <MessageSquare size={10} className="text-[#A0A0A0]" />
              </div>
            </div>
          </motion.div>

          {/* Card B: Schedule Card (Left Layer) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -left-16 top-20 w-[165px] rounded-[14px] border border-[#E0E0E0] bg-white/95 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
            style={{ transform: "translateZ(85px)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#0A0A0A] flex items-center gap-1">
                <Calendar size={11} className="text-[#6B6B6B]" /> Schedule
              </span>
              <span className="rounded bg-[#0A0A0A] text-white px-1.5 py-0.5 text-[8px] font-semibold tracking-wider">
                TUE, 12
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-[9px] text-[#6B6B6B]">
              <div className="flex items-center justify-between py-0.5 border-b border-[#F7F7F7]">
                <span>09:00</span>
                <span className="h-1 w-12 bg-[#E2E2E2] rounded-full" />
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-[#F7F7F7]">
                <span className="font-medium text-[#0A0A0A]">10:00</span>
                <span className="h-1.5 w-14 rounded-full bg-[var(--accent)]" />
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-[#F7F7F7]">
                <span>11:00</span>
                <span className="h-1 w-10 bg-[#E2E2E2] rounded-full" />
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span>12:00</span>
                <span className="h-1 w-8 bg-[#E2E2E2] rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Card C: To-do List (Middle-Left Layer) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            className="absolute -left-8 bottom-14 w-[170px] rounded-[14px] border border-[#E0E0E0] bg-white/95 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
            style={{ transform: "translateZ(105px)" }}
          >
            <div className="text-[11px] font-semibold text-[#0A0A0A] mb-2">To-do list</div>
            <div className="flex flex-col gap-2">
              {/* Checked item */}
              <div className="flex items-center gap-2">
                <div
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px]"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <Check size={10} className="text-[#0A0A0A] stroke-[3]" />
                </div>
                <div className="flex-1 h-1.5 rounded bg-[#0A0A0A]/80" />
              </div>
              {/* Unchecked item 1 */}
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-[4px] border border-[#D0D0D0] bg-white" />
                <div className="flex-1 h-1.5 rounded bg-[#D0D0D0]" />
              </div>
              {/* Unchecked item 2 */}
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-[4px] border border-[#D0D0D0] bg-white" />
                <div className="w-12 h-1.5 rounded bg-[#E4E4E4]" />
              </div>
            </div>
          </motion.div>

          {/* Card D: Overall Performance (Bottom-Right Layer) */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-4, 6, -4] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -right-8 bottom-10 w-[175px] rounded-[14px] border border-[#E0E0E0] bg-white/95 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
            style={{ transform: "translateZ(75px)" }}
          >
            <div className="flex items-center justify-between text-[10px] text-[#6B6B6B] mb-1">
              <span>Performance</span>
              <BarChart2 size={11} className="text-[#6B6B6B]" />
            </div>
            <div className="text-[18px] font-bold text-[#0A0A0A] tracking-tight">85.3%</div>
            {/* Slanted / bar chart graphic */}
            <div className="mt-2 flex items-end gap-1.5 h-7 pt-1 border-t border-[#F2F2F2]">
              <div className="w-2.5 h-3 rounded-t-sm bg-[#E0E0E0]" />
              <div className="w-2.5 h-4.5 rounded-t-sm bg-[#B0B0B0]" />
              <div className="w-2.5 h-2.5 rounded-t-sm bg-[#E0E0E0]" />
              <div className="w-2.5 h-6 rounded-t-sm bg-[#0A0A0A]" />
              <div
                className="w-2.5 h-5 rounded-t-sm"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div className="w-2.5 h-3.5 rounded-t-sm bg-[#0A0A0A]" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
