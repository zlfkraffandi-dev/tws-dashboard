"use client";

import React, { useState } from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Radio,
  Calculator,
  BellRing,
  Sparkles,
  Target,
  AlertTriangle
} from "lucide-react";

export default function ActivePositions() {
  const { trades, setSelectedTrade } = useTradeStore();
  const activeTrades = trades.filter(
    (t) => t.status === "ACTIVE" || t.status === "TP1_HIT" || t.status === "PENDING_LIMIT"
  );

  // Risk Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(2000);
  const [riskPercentage, setRiskPercentage] = useState<number>(2); // 2% per trade = $40

  const calculateSizing = (entry: number, sl: number) => {
    const riskDollar = (accountBalance * riskPercentage) / 100;
    const priceRiskPerUnit = Math.abs(entry - sl);
    const units = priceRiskPerUnit > 0 ? (riskDollar / priceRiskPerUnit) : 0;
    const positionValue = units * entry;
    return {
      riskDollar,
      units: parseFloat(units.toFixed(3)),
      positionValue: parseFloat(positionValue.toFixed(2))
    };
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            🎯 Tactical Battle Cockpit (Posisi Menunggu & Berjalan)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Khusus setup aktif yang sedang dikawal. Trade selesai diarsipkan terpisah di Buku Besar bawah.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30">
            <Radio className="h-3 w-3 animate-pulse" /> 24/7 Cloud Sentinel
          </span>
          <span className="text-slate-300 font-semibold">{activeTrades.length} Setup Berjalan</span>
        </div>
      </div>

      {activeTrades.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">100% Kas Bersih (Zero Exposure)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Semua trade sebelumnya telah selesai dievaluasi. Akun dalam mode siaga defensif menunggu setup Grade A+ berikutnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {activeTrades.map((trade, idx) => {
            const isPending = trade.status === "PENDING_LIMIT";
            const isTp1Hit = trade.status === "TP1_HIT";
            const pnlPct = ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
            const distanceToEntry = trade.currentPrice - trade.entryPrice;
            const distanceToEntryPct = ((distanceToEntry) / trade.entryPrice) * 100;
            const sizing = calculateSizing(trade.entryPrice, trade.stopLoss);

            // Distance to targets
            const distanceToTp1 = Math.max(0, trade.tp1 - trade.currentPrice);
            const distanceToTp2 = Math.max(0, trade.tp2 - trade.currentPrice);

            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl hover:border-amber-500/50 transition-all space-y-5"
              >
                {/* Glow Accent Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400"></div>

                {/* Top Row: Symbol, Status, Live Price */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl font-black font-mono text-slate-100 group-hover:text-amber-400 transition-colors">
                        {trade.symbol}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 font-mono">
                        {trade.side}
                      </span>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/40 animate-pulse">
                          <Clock className="h-3.5 w-3.5" />
                          Antri Limit di ${trade.entryPrice}
                        </span>
                      ) : isTp1Hit ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-3 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/50">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          100% Free Trade (BE)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/40">
                          <Radio className="h-3.5 w-3.5 animate-pulse" />
                          In Position (Running)
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 font-mono">
                      Struktur: <span className="text-slate-200">{trade.amtSetupType}</span>
                    </p>
                  </div>

                  {/* Price & Distance Column */}
                  <div className="sm:text-right bg-slate-950/70 p-3 sm:p-0 rounded-xl sm:bg-transparent border sm:border-0 border-slate-800">
                    <div className="flex items-center sm:justify-end gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
                      <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-400">
                        ${trade.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-semibold mt-1">
                      {isPending ? (
                        <span className="text-amber-300 flex items-center sm:justify-end gap-1">
                          <span>Jarak ke Jemputan:</span>
                          <b className="text-amber-400">
                            {distanceToEntry > 0 ? `-$${distanceToEntry.toFixed(2)} (-${distanceToEntryPct.toFixed(2)}%)` : "Area Fill!"}
                          </b>
                        </span>
                      ) : (
                        <span className="text-emerald-300 flex items-center sm:justify-end gap-1">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          +{pnlPct.toFixed(2)}% (+{trade.totalR.toFixed(2)}R)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone Targets Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl bg-slate-950/80 p-3.5 border border-slate-800 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Titik Antri (Entry)</div>
                    <div className="font-bold text-slate-100 text-sm mt-1">${trade.entryPrice}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">Retest BOS $118</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Stop Loss Terukur</div>
                    <div className="font-bold text-rose-400 text-sm mt-1">${trade.stopLoss}</div>
                    <div className="text-[10px] text-rose-500/80 mt-0.5">-1.00R Disiplin</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Target 1 (Lock BE)</div>
                    <div className="font-bold text-cyan-300 text-sm mt-1">${trade.tp1}</div>
                    <div className="text-[10px] text-cyan-400 mt-0.5">+2.00R (Amankan 50%)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Target 2 (Final)</div>
                    <div className="font-extrabold text-emerald-300 text-sm mt-1">${trade.tp2}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">+4.17R (R:R 1:4.17)</div>
                  </div>
                </div>

                {/* Tactical Action SOP Playbook (Discipline First) */}
                <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Target className="h-4 w-4 text-amber-400" />
                    <span>Tactical Execution Playbook (SOP Disiplin TWS):</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-amber-400 font-bold">1. Fase Antri Limit:</span>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans">
                        Order limit buy di <b>$117.50</b>. Dilarang mengejar candle hijau di pucuk lelang ($119+).
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-cyan-400 font-bold">2. Saat TP1 $123.50:</span>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans">
                        Ambil 50% profit & <b>wajib geser SL ke $117.50 (BEP)</b>. Trade resmi 100% bebas risiko!
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-emerald-400 font-bold">3. Menuju TP2 $130.00:</span>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans">
                        Trailing sisa 50% muatan hingga $130.00. Tutup penuh tanpa serakah (*anti round-tripping*).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Position Sizer & Risk Calculator */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/10 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Calculator className="h-4 w-4 text-emerald-400" />
                      <span>Kalkulator Ukuran Lot & Manajemen Risiko Otomatis:</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Modal: ${accountBalance} | Resiko: {riskPercentage}% (${sizing.riskDollar})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-sans">Modal Akun ($):</label>
                      <input
                        type="number"
                        value={accountBalance}
                        onChange={(e) => setAccountBalance(Number(e.target.value) || 100)}
                        className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-sans">Resiko per Trade (%):</label>
                      <select
                        value={riskPercentage}
                        onChange={(e) => setRiskPercentage(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                      >
                        <option value={1}>1.0% ($ {accountBalance * 0.01})</option>
                        <option value={2}>2.0% ($ {accountBalance * 0.02})</option>
                        <option value={3}>3.0% ($ {accountBalance * 0.03})</option>
                        <option value={5}>5.0% ($ {accountBalance * 0.05})</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-emerald-400 uppercase font-sans font-bold">Ukuran Beli Rekomendasi:</label>
                      <div className="mt-1 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                        {sizing.units} SOL (~${sizing.positionValue})
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-sans">Ekspektasi Hasil:</label>
                      <div className="mt-1 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                        <span className="text-rose-400">SL: -${sizing.riskDollar}</span> | <span className="text-emerald-400">TP2: +${(sizing.riskDollar * 4.17).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cloud Sentinel Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-3.5 w-3.5 text-amber-400" />
                    <span>TradingView Cloud Alerts:</span>
                    <span className="text-slate-200">#5677194289 (Entry) • #5677195388 (TP1) • #5677195617 (SL)</span>
                  </div>
                  <button
                    onClick={() => setSelectedTrade(trade)}
                    className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                  >
                    Buka Detail Autopsi & Strategi Lengkap &rarr;
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
