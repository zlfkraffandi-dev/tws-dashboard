"use client";

import React from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowUpRight, CheckCircle2, Clock, Radio } from "lucide-react";

export default function ActivePositions() {
  const { trades, setSelectedTrade, isLoading } = useTradeStore();
  const activeTrades = trades.filter((t) => t.status === "ACTIVE" || t.status === "TP1_HIT");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-slate-200 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Posisi Aktif Berjalan (Live Real-Time Stream)
        </h2>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <Radio className="h-3 w-3 animate-pulse" /> Auto-Sync Active
          </span>
          <span>{activeTrades.length} Posisi Terbuka</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeTrades.map((trade, idx) => {
          const isTp1Hit = trade.status === "TP1_HIT";
          const pnlPct = ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
          
          // Calculate progress percentage to TP2
          const totalDistance = trade.tp2 - trade.entryPrice;
          const currentDistance = Math.max(0, trade.currentPrice - trade.entryPrice);
          const progressPct = Math.min(100, Math.max(0, Math.round((currentDistance / totalDistance) * 100)));
          const distanceToTp2 = Math.max(0, trade.tp2 - trade.currentPrice);

          return (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              onClick={() => setSelectedTrade(trade)}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {trade.symbol}
                    </span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 font-mono">
                      {trade.side}
                    </span>
                    {isTp1Hit && (
                      <span className="flex items-center gap-1 rounded bg-emerald-950/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
                        <ShieldCheck className="h-3 w-3" />
                        100% Free Trade (BE)
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                    {trade.amtSetupType}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight">
                      ${trade.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                    </div>
                  </div>
                  <div className="text-xs font-mono font-semibold text-emerald-300 flex items-center justify-end gap-0.5 mt-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    +{pnlPct.toFixed(2)}% (+{trade.totalR.toFixed(2)}R)
                  </div>
                </div>
              </div>

              {/* Middle Metrics Row */}
              <div className="my-4 grid grid-cols-4 gap-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 text-center font-mono text-xs">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-sans">Titik Entry</div>
                  <div className="font-semibold text-slate-200 mt-0.5">${trade.entryPrice}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-sans">Stop Loss</div>
                  <div className={`font-semibold mt-0.5 ${isTp1Hit ? "text-emerald-400" : "text-rose-400"}`}>
                    ${trade.stopLoss} {isTp1Hit && "(BE)"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-sans">Target 1</div>
                  <div className={`font-semibold mt-0.5 ${isTp1Hit ? "text-emerald-400 line-through opacity-70" : "text-slate-200"}`}>
                    ${trade.tp1}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-sans">Final TP (Mentok)</div>
                  <div className="font-bold text-emerald-300 mt-0.5">${trade.tp2}</div>
                </div>
              </div>

              {/* Dynamic Auction Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    {isTp1Hit ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Clock className="h-3.5 w-3.5 text-cyan-400" />}
                    {isTp1Hit ? "TP1 Terlewati (Puncak $2.65)" : "Sedang Menuju TP1"}
                  </span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {progressPct}% ke Final TP (Sisa ${distanceToTp2.toFixed(3)})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-sm shadow-emerald-500/50"
                  />
                </div>
              </div>

              {/* Click Hint */}
              <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/50 pt-2">
                <span>Klik kartu untuk buka detail autopsi & strategi lelang</span>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform font-mono text-xs">Detail &rarr;</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
