"use client";

import React from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { TradeStatus } from "@/types/trade";
import { Search, Filter, AlertCircle, CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TradeLedgerTable() {
  const { trades, filterStatus, setFilterStatus, searchQuery, setSearchQuery, setSelectedTrade } = useTradeStore();

  // Strictly isolate archived/completed trades so they NEVER mix with active/pending setups
  const archivedTrades = trades.filter((t) => t.status === "CLOSED_WIN" || t.status === "STOP_LOSS");

  const filteredTrades = archivedTrades.filter((t) => {
    const matchesFilter = filterStatus === "ALL" ? true : t.status === filterStatus;
    const matchesSearch =
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amtSetupType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: TradeStatus) => {
    switch (status) {
      case "CLOSED_WIN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" /> Full Win
          </span>
        );
      case "STOP_LOSS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/30">
            <XCircle className="h-3 w-3" /> Hit Stop Loss
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            🏛️ Arsip Buku Besar & Evaluasi Autopsi (Historical Trade Ledger)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Khusus rekam jejak trade yang telah selesai ditutup 100%. Posisi aktif & antrian limit dikawal terpisah di Tactical Cockpit atas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Color Indicator Legend */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono bg-slate-950/90 rounded-lg px-3 py-1.5 border border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50"></span>
              Hijau: Goal / Full Win
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-400 shadow-sm shadow-rose-500/50"></span>
              Merah: Hit Stop Loss (-1R)
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari simbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg bg-slate-950/80 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 w-36 sm:w-44"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-950/90 rounded-lg p-1 border border-slate-800 text-xs">
            {(["ALL", "CLOSED_WIN", "STOP_LOSS"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                  filterStatus === st
                    ? "bg-slate-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st === "ALL"
                  ? "Semua Arsip"
                  : st === "CLOSED_WIN"
                  ? "Menang (Win)"
                  : "Kalah Terukur (Loss)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
              <th className="py-3 px-3">Koin & Tipe</th>
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">Entry</th>
              <th className="py-3 px-3">Stop Loss</th>
              <th className="py-3 px-3">Target Profit</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Hasil (R)</th>
              <th className="py-3 px-3 text-center">Autopsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredTrades.map((trade) => {
              const isProfit = trade.status === "CLOSED_WIN" || trade.totalR > 0;
              const isLoss = trade.status === "STOP_LOSS" || trade.totalR < 0;

              return (
                <tr
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade)}
                  className={`transition-all duration-200 cursor-pointer group ${
                    isLoss
                      ? "bg-rose-950/20 hover:bg-rose-900/35 border-l-4 border-l-rose-500"
                      : "bg-emerald-950/20 hover:bg-emerald-900/35 border-l-4 border-l-emerald-500"
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold transition-colors ${
                          isLoss
                            ? "text-rose-200 group-hover:text-rose-100"
                            : "text-emerald-200 group-hover:text-emerald-100"
                        }`}
                      >
                        {trade.symbol}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${
                          isLoss
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {trade.amtSetupType}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                    {trade.callDate}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-200 font-semibold">
                    ${trade.entryPrice}
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <span
                      className={`inline-block font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                        isLoss
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "text-rose-400"
                      }`}
                    >
                      ${trade.stopLoss}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    <div className="text-[11px] text-slate-400">TP1: ${trade.tp1}</div>
                    <span
                      className={`font-bold inline-block text-xs mt-0.5 ${
                        isProfit
                          ? "bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40"
                          : "text-slate-400"
                      }`}
                    >
                      Final: ${trade.tp2}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {getStatusBadge(trade.status)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold font-mono text-xs border ${
                        isProfit
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950/50"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950/50"
                      }`}
                    >
                      {isProfit ? `+${trade.totalR.toFixed(2)}R` : `${trade.totalR.toFixed(2)}R`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all border ${
                        isLoss
                          ? "bg-rose-950/80 border-rose-500/40 text-rose-300 group-hover:bg-rose-600 group-hover:text-white"
                          : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-600 group-hover:text-slate-950"
                      }`}
                    >
                      {isLoss ? "Autopsi →" : "Detail →"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
