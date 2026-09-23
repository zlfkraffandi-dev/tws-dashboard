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

        <div className="flex flex-wrap items-center gap-2">
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
              const isProfit = trade.totalR > 0;
              const isLoss = trade.totalR < 0;

              return (
                <tr
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {trade.symbol}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                        {trade.side}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                      {trade.amtSetupType}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {trade.callDate}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200">
                    ${trade.entryPrice}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={trade.status === "TP1_HIT" ? "text-emerald-400 font-semibold" : "text-rose-400"}>
                      ${trade.stopLoss}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    TP1: ${trade.tp1} <br />
                    <span className="text-emerald-400 font-semibold">Final: ${trade.tp2}</span>
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(trade.status)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-sm">
                    <span
                      className={
                        isProfit ? "text-emerald-400" : isLoss ? "text-rose-400" : "text-slate-400"
                      }
                    >
                      {isProfit ? `+${trade.totalR.toFixed(2)}R` : `${trade.totalR.toFixed(2)}R`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="rounded-lg bg-slate-800/80 group-hover:bg-emerald-600 group-hover:text-slate-950 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors">
                      Buka &rarr;
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
