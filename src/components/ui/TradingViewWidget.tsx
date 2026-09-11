"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, BarChart2, Radio } from "lucide-react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const symbols = [
  { label: "NEAR/USDT (Trade #001)", symbol: "BYBIT:NEARUSDT.P", badge: "TP1 Hit · Free Trade" },
  { label: "TAO/USDT (Trade #003)", symbol: "BYBIT:TAOUSDT.P", badge: "Limit Filled" },
  { label: "BTC/USDT (Makro)", symbol: "BYBIT:BTCUSDT.P", badge: "Risk-On" },
  { label: "DOT/USDT", symbol: "BYBIT:DOTUSDT.P", badge: "Full Win (+3.71R)" },
  { label: "UNI/USDT", symbol: "BYBIT:UNIUSDT.P", badge: "Hit SL (-1.0R)" },
];

export default function TradingViewWidget() {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0].symbol);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Unique ID for widget container
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
          studies: [
            "MASimple@tv-basicstudies",
            "MACD@tv-basicstudies"
          ],
          backgroundColor: "rgba(3, 7, 18, 1)",
          gridColor: "rgba(30, 41, 59, 0.4)",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedSymbol]);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg space-y-4">
      {/* Widget Header & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              TradingView Live Chart Stream
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <Radio className="h-2.5 w-2.5 animate-pulse" /> Live Tick
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualisasi grafik interaktif langsung di dashboard (Bisa ganti indikator & gambar garis)
            </p>
          </div>
        </div>

        {/* Quick Symbol Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/90 rounded-xl p-1 border border-slate-800 text-xs">
          {symbols.map((item) => (
            <button
              key={item.symbol}
              onClick={() => setSelectedSymbol(item.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                selectedSymbol === item.symbol
                  ? "bg-emerald-600 text-slate-950 font-bold shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>{item.label.split(" ")[0]}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded ${selectedSymbol === item.symbol ? "bg-emerald-800 text-emerald-100" : "bg-slate-800 text-slate-400"}`}>
                {item.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Embed */}
      <div className="w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner">
        <div ref={containerRef} className="w-full h-[520px]" />
      </div>
    </div>
  );
}
