"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Layers, Sparkles, CheckCircle2, Eye } from "lucide-react";
import Image from "next/image";

declare global {
  interface Window {
    TradingView: any;
  }
}

const symbols = [
  { label: "UNI/USDT (Champion Candidate)", symbol: "BYBIT:UNIUSDT.P", badge: "Diskon -10.8% S/R Flip" },
  { label: "NEAR/USDT (Momentum Leader)", symbol: "BYBIT:NEARUSDT.P", badge: "Vol $2.33B Retest $4.00" },
  { label: "SOL/USDT (Trade #005 - Closed SL)", symbol: "BYBIT:SOLUSDT.P", badge: "Evaluasi VAH Sweep" },
  { label: "BTC/USDT (Makro)", symbol: "BYBIT:BTCUSDT.P", badge: "Jangkar Makro $84k" },
  { label: "ETH/USDT", symbol: "BYBIT:ETHUSDT.P", badge: "Konsolidasi $2,679" },
];

export default function TradingViewWidget() {
  const [activeTab, setActiveTab] = useState<"SYNCED_ACCOUNT" | "INTERACTIVE">("SYNCED_ACCOUNT");
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0].symbol);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== "INTERACTIVE") return;

    const containerId = "tv_chart_container";
    if (!containerRef.current) return;

    containerRef.current.innerHTML = `<div id="${containerId}" style="height: 520px; width: 100%;"></div>`;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        new window.TradingView.widget({
          autosize: true,
          symbol: selectedSymbol,
          interval: "60",
          timezone: "Asia/Jakarta",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#030712",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          hide_side_toolbar: false,
          studies: [],
          backgroundColor: "rgba(3, 7, 18, 1)",
          gridColor: "rgba(30, 41, 59, 0.4)",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [activeTab, selectedSymbol]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400" />
              TradingView Visual Station (Markingan & Chart Sinkron)
            </h3>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 font-mono">
              Live Desktop Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Markingan Fibonacci, Long Position Tool, dan 3 Alert Webhook yang dibuat di Desktop disinkronkan ke sini.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/90 rounded-xl p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("SYNCED_ACCOUNT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === "SYNCED_ACCOUNT"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Markingan Akun Anda (Live Sync)
          </button>
          <button
            onClick={() => setActiveTab("INTERACTIVE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === "INTERACTIVE"
                ? "bg-slate-800 text-slate-100 border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            Interactive Ticker
          </button>
        </div>
      </div>

      {/* TAB 1: Live Synced Account Chart (Shows exact drawings) */}
      {activeTab === "SYNCED_ACCOUNT" && (
        <div className="space-y-3">
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950 group">
            <div className="relative aspect-[16/9] w-full max-h-[560px]">
              <Image
                src="/uni_chart_tradingview.png"
                alt="TradingView Live Sync Chart with Drawings - UNIUSDT"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Floating Top Banner */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/80 backdrop-blur-md px-3 py-1.5 border border-slate-800/80 text-xs font-mono text-slate-200 pointer-events-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Akun: <b>zulfikaraffandi7</b> (Red List Synced: UNIUSDT.P)</span>
              </div>

              <a
                href="https://www.tradingview.com/chart/bpnbT4ic/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all pointer-events-auto shadow-lg"
              >
                <span>Buka Full di TradingView</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Bottom Marking Highlights */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/90 backdrop-blur-md p-2.5 border border-slate-800/80 text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  Demand Shelf S/R Flip ($8.90 &ndash; $9.15)
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Long Box (Entry $8.90 | SL $8.38 [-1.00R] | TP1 $9.90 | TP2 $10.80 [+3.65R])
                </span>
              </div>
              <span className="text-amber-400 font-semibold">
                Red List Watchlist Aktif
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Widget with Quick Symbol Switcher */}
      {activeTab === "INTERACTIVE" && (
        <div className="space-y-3">
          {/* Symbol Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {symbols.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setSelectedSymbol(s.symbol)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                  selectedSymbol === s.symbol
                    ? "bg-slate-800 text-slate-100 border border-slate-700 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-slate-200"
                }`}
              >
                <span>{s.label}</span>
                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-emerald-400 border border-slate-800">
                  {s.badge}
                </span>
              </button>
            ))}
          </div>

          <div
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950"
          />
        </div>
      )}
    </div>
  );
}
