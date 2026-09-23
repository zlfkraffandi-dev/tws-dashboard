"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Info, CheckCircle2, XCircle } from "lucide-react";
import { useTradeStore } from "@/stores/useTradeStore";

interface CurvePoint {
  id: string;
  label: string;
  sub: string;
  r: number;
  delta: number;
  status: "START" | "WIN" | "STOP_LOSS";
  desc: string;
  pnlNote: string;
}

export default function EquityCurveChart() {
  const { stats } = useTradeStore();
  const [activePoint, setActivePoint] = useState<CurvePoint | null>(null);

  // Full chronological history of completed trades
  const points: CurvePoint[] = [
    {
      id: "START",
      label: "Mulai",
      sub: "6 Sep",
      r: 0,
      delta: 0,
      status: "START",
      desc: "Modal Kas Bersih Awal",
      pnlNote: "Saldo: 0.00R (Risk Basis)"
    },
    {
      id: "UNI",
      label: "UNI",
      sub: "8 Sep",
      r: -1.0,
      delta: -1.0,
      status: "STOP_LOSS",
      desc: "Cutloss Terukur di SL $6.60 (-1.00R)",
      pnlNote: "Dump dihindari: Stop loss menyelamatkan dari crash ke $5.98"
    },
    {
      id: "DOT",
      label: "DOT",
      sub: "9 Sep",
      r: 2.71,
      delta: 3.71,
      status: "WIN",
      desc: "Full Win TP2 Eksekusi $1.26 (+3.71R Net)",
      pnlNote: "Rebound sempurna dari liquidity sweep support lelang"
    },
    {
      id: "TAO",
      label: "TAO",
      sub: "11 Sep Pagi",
      r: 1.71,
      delta: -1.0,
      status: "STOP_LOSS",
      desc: "Cutloss di SL $237.50 (-1.00R)",
      pnlNote: "Volatilitas AI outperformer diproteksi ketat -1.00R"
    },
    {
      id: "NEAR",
      label: "NEAR",
      sub: "11 Sep Malam",
      r: 4.17,
      delta: 2.46,
      status: "WIN",
      desc: "TP1 & TP2 Hit Sempurna $2.72 (+2.46R Net)",
      pnlNote: "Breakout Retest Acceptance berjalan presisi"
    },
    {
      id: "SUI",
      label: "SUI",
      sub: "14 Sep",
      r: 3.17,
      delta: -1.0,
      status: "STOP_LOSS",
      desc: "Hit Stop Loss di $0.685 (-1.00R)",
      pnlNote: "Stop Loss memproteksi modal saat likuidasi dump ke $0.671"
    },
  ];

  const minR = -1.8;
  const maxR = 5.2;
  const range = maxR - minR;

  // SVG dimensions
  const width = 1200;
  const height = 250;
  const padX = 65;
  const padY = 40;

  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * chartW;
    const y = padY + chartH - ((p.r - minR) / range) * chartH;
    return { ...p, x, y };
  });

  // Zero-line Y coordinate
  const zeroY = padY + chartH - ((0 - minR) / range) * chartH;
  const bottomY = height - padY + 10;

  // Generate segments: each segment is colored RED for Stop Loss, GREEN for Win/Goal
  const segments = coords.slice(1).map((curr, idx) => {
    const prev = coords[idx];
    const cx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) * 0.5;
    const cy2 = curr.y;

    const lineD = `M ${prev.x} ${prev.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    const areaD = `M ${prev.x} ${prev.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y} L ${curr.x} ${bottomY} L ${prev.x} ${bottomY} Z`;

    const isLoss = curr.status === "STOP_LOSS" || curr.delta < 0;

    return {
      id: `${prev.id}->${curr.id}`,
      prev,
      curr,
      lineD,
      areaD,
      isLoss,
      color: isLoss ? "#f43f5e" : "#10b981",
      areaFill: isLoss ? "url(#gradientRed)" : "url(#gradientGreen)",
      filter: isLoss ? "url(#glowRed)" : "url(#glowGreen)",
    };
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg space-y-4">
      {/* Header with Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Kurva Akumulasi R-Multiple (Equity Growth Curve)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Jalur saldo portofolio: Segmen hijau = Trade Goal / TP, Segmen merah = Stop Loss Terukur (-1R).
          </p>
        </div>

        {/* Color Legend & Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 bg-slate-950/90 rounded-lg px-3 py-1.5 border border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/60"></span>
              Garis Hijau: Goal / Win
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/60"></span>
              Garis Merah: Stop Loss (-1R)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5">
              Surplus Bersih: <strong className="text-emerald-400 font-bold">+{stats.netRMultiple.toFixed(2)}R</strong>
            </span>
            <span className="flex items-center gap-1.5">
              Max DD: <strong className="text-rose-400 font-bold">-{stats.maxDrawdownR.toFixed(2)}R</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none overflow-visible">
          <defs>
            {/* Green Gradient Area for Winning Trades */}
            <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
              <stop offset="85%" stopColor="#10b981" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Red Gradient Area for Stop Loss Trades */}
            <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.30" />
              <stop offset="85%" stopColor="#f43f5e" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.75" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f43f5e" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* Zero baseline */}
          <line
            x1={padX - 10}
            y1={zeroY}
            x2={width - padX + 10}
            y2={zeroY}
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1.2"
          />
          <text
            x={padX - 16}
            y={zeroY + 4}
            fill="#64748b"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
            fontWeight="bold"
          >
            0.00R (BEP)
          </text>

          {/* Render Area Fills per Segment */}
          {segments.map((seg) => (
            <path
              key={`area-${seg.id}`}
              d={seg.areaD}
              fill={seg.areaFill}
              className="transition-opacity duration-300"
            />
          ))}

          {/* Render Colored Curved Segment Lines */}
          {segments.map((seg) => (
            <motion.path
              key={`line-${seg.id}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              d={seg.lineD}
              fill="none"
              stroke={seg.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter={seg.filter}
            />
          ))}

          {/* Render Coordinate Points & Interactive Badges */}
          {coords.map((pt) => {
            const isLoss = pt.status === "STOP_LOSS";
            const isWin = pt.status === "WIN";
            const isStart = pt.status === "START";

            const badgeBg = isLoss ? "#4c0519" : isWin ? "#022c22" : "#0f172a";
            const badgeStroke = isLoss ? "#f43f5e" : isWin ? "#10b981" : "#475569";
            const textColor = isLoss ? "#fda4af" : isWin ? "#6ee7b7" : "#cbd5e1";
            const deltaText = isStart
              ? "0R Mulai"
              : isLoss
              ? `${pt.r.toFixed(2)}R (-1R SL)`
              : `+${pt.r.toFixed(2)}R (+${pt.delta.toFixed(2)}R TP)`;

            return (
              <g
                key={pt.id}
                className="cursor-pointer group"
                onMouseEnter={() => setActivePoint(pt)}
                onClick={() => setActivePoint(pt)}
              >
                {/* Outer Glow Ring on Hover */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="transparent"
                  stroke={isLoss ? "#f43f5e" : isWin ? "#10b981" : "#64748b"}
                  strokeWidth="1.5"
                  strokeDasharray={isLoss ? "2 2" : undefined}
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                />

                {/* Point Center Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5.5"
                  fill="#020617"
                  stroke={isLoss ? "#f43f5e" : isWin ? "#10b981" : "#94a3b8"}
                  strokeWidth="2.5"
                />

                {/* Value Pill Badge above Node */}
                <g transform={`translate(${pt.x}, ${pt.y - 28})`}>
                  <rect
                    x={isStart ? -32 : -46}
                    y="-12"
                    width={isStart ? 64 : 92}
                    height="20"
                    rx="10"
                    fill={badgeBg}
                    stroke={badgeStroke}
                    strokeWidth="1.2"
                    className="filter drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                  <text
                    x="0"
                    y="2"
                    fill={textColor}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {deltaText}
                  </text>
                </g>

                {/* Label & Date below chart */}
                <text
                  x={pt.x}
                  y={height - 18}
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {pt.label}
                </text>
                <text
                  x={pt.x}
                  y={height - 5}
                  fill="#64748b"
                  fontSize="9.5"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {pt.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Point Detail Preview */}
      <AnimatePresence mode="wait">
        {activePoint ? (
          <motion.div
            key={activePoint.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono transition-colors ${
              activePoint.status === "STOP_LOSS"
                ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                : activePoint.status === "WIN"
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {activePoint.status === "STOP_LOSS" ? (
                <XCircle className="h-4 w-4 text-rose-400" />
              ) : activePoint.status === "WIN" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Info className="h-4 w-4 text-slate-400" />
              )}
              <span className="font-bold text-slate-100">{activePoint.label} ({activePoint.sub}):</span>
              <span>{activePoint.desc}</span>
            </div>
            <div className="font-semibold text-[11px] opacity-90">
              {activePoint.pnlNote}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-800 pt-2 font-sans">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Setiap 1R merepresentasikan risiko modal tetap. Garis merah membuktikan pemotongan kerugian sedini mungkin sebelum bertambah besar.
          </span>
        </span>
        <span className="text-emerald-400 font-mono font-semibold">TWS Discipline Validated</span>
      </div>
    </div>
  );
}
