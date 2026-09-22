"use client";

import React from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { Download, RefreshCw, Activity, ShieldCheck, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { macro, stats, exportToCsv, refreshPrices, isLoading } = useTradeStore();

  return (
    <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold shadow-lg shadow-emerald-950/30">
            TWS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-100 font-sans">
                TWS Quant Terminal
              </h1>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                TV Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auction Market Theory & Sully Matrix System
            </p>
          </div>
        </div>

        {/* Center macro tickers */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-full px-4 py-1.5 text-xs shadow-inner">
          <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800 text-slate-300">
            <span className={`h-2 w-2 rounded-full ${
              macro.regime === "GREEN" ? "bg-emerald-500" : macro.regime === "YELLOW" ? "bg-amber-400 animate-pulse" : "bg-rose-500"
            }`}></span>
            <span className={`font-semibold ${
              macro.regime === "GREEN" ? "text-emerald-400" : macro.regime === "YELLOW" ? "text-amber-400" : "text-rose-400"
            }`}>REZIM: {macro.regime}</span>
            <span className="text-slate-500 font-mono">({macro.notes.slice(0, 24)}...)</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <span className="text-slate-400 font-medium">BTC:</span>
            <span className="font-mono font-bold text-slate-200">
              ${macro.btcPrice.toLocaleString("en-US")}
            </span>
            <span
              className={`font-mono text-[11px] font-semibold ${
                macro.btcChange24h >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {macro.btcChange24h >= 0 ? "+" : ""}
              {macro.btcChange24h}%
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshPrices}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 px-3 py-2 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Sync</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCsv}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold px-3.5 py-2 text-xs transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV / Excel</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
