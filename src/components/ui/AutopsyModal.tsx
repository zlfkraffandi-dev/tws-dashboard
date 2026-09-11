"use client";

import React from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, ShieldCheck, Lightbulb, CheckCircle2 } from "lucide-react";

export default function AutopsyModal() {
  const { selectedTrade, setSelectedTrade } = useTradeStore();

  if (!selectedTrade || !selectedTrade.autopsy) return null;

  const isLoss = selectedTrade.status === "STOP_LOSS";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedTrade(null)}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                isLoss
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {isLoss ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 font-mono">
                  {selectedTrade.symbol} ({selectedTrade.side})
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-mono font-bold ${
                    isLoss ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {selectedTrade.totalR >= 0 ? `+${selectedTrade.totalR.toFixed(2)}R` : `${selectedTrade.totalR.toFixed(2)}R`}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                {selectedTrade.amtSetupType} � {selectedTrade.callDate}
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="mt-5 space-y-4 text-xs font-sans">
            {/* Summary Box */}
            <div className={`p-3 rounded-xl border ${isLoss ? "bg-rose-950/30 border-rose-800/40 text-rose-200" : "bg-emerald-950/30 border-emerald-800/40 text-emerald-200"}`}>
              <div className="font-semibold text-sm mb-1">{selectedTrade.autopsy.summary}</div>
              <p className="text-slate-300 leading-relaxed">{selectedTrade.autopsy.whatHappened}</p>
            </div>

            {/* Key Lesson */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Lightbulb className="h-4 w-4" />
                <span>Pelajaran Utama (*Key Lesson*):</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedTrade.autopsy.keyLesson}
              </p>
            </div>

            {/* Safeguard Rule */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>SOP & Aturan Perlindungan Portofolio:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedTrade.autopsy.safeguardRule}
              </p>
            </div>
          </div>

          {/* Footer stats */}
          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Entry: ${selectedTrade.entryPrice} � SL: ${selectedTrade.stopLoss}</span>
            <span>Target Final: ${selectedTrade.tp2}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
