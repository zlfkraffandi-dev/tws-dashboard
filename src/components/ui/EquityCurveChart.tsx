"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Info } from "lucide-react";

export default function EquityCurveChart() {
  const points = [
    { label: "Mulai (6 Sep)", r: 0, desc: "Modal Awal" },
    { label: "UNI (8 Sep)", r: -1.0, desc: "Cutloss di SL $6.60 (-1.0R)" },
    { label: "DOT (9 Sep)", r: 2.71, desc: "Full Win TP2 (+3.71R Net)" },
    { label: "NEAR (10 Sep)", r: 4.27, desc: "TP1 Hit $2.484 (+1.56R)" },
    { label: "TAO (11 Sep)", r: 3.27, desc: "Cutloss di SL $237.50 (-1.0R)" },
  ];

  const minR = -1.5;
  const maxR = 5.5;
  const range = maxR - minR;

  // SVG dimensions
  const width = 1200;
  const height = 220;
  const padX = 50;
  const padY = 30;

  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * chartW;
    const y = padY + chartH - ((p.r - minR) / range) * chartH;
    return { ...p, x, y };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = coords[idx - 1];
    const cx = (prev.x + curr.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  // Zero-line Y coordinate
  const zeroY = padY + chartH - ((0 - minR) / range) * chartH;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Kurva Akumulasi R-Multiple (Equity Growth Curve)
          </h3>
          <p className="text-xs text-slate-400">
            Perjalanan saldo keuntungan bersih portofolio dari tiap trade
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Surplus: <strong className="text-emerald-400">+4.49R</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
            Max DD: <strong className="text-rose-400">-1.00R</strong>
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Zero baseline */}
          <line
            x1={padX}
            y1={zeroY}
            x2={width - padX}
            y2={zeroY}
            stroke="#334155"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text x={padX - 8} y={zeroY + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
            0R
          </text>

          {/* Area fill */}
          <path d={areaD} fill="url(#gradientArea)" />

          {/* Line curve */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Coordinate points */}
          {coords.map((pt, i) => (
            <g key={pt.label}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#0f172a"
                stroke={pt.r >= 0 ? "#10b981" : "#f43f5e"}
                strokeWidth="2.5"
              />
              <text
                x={pt.x}
                y={pt.y - 10}
                fill={pt.r >= 0 ? "#34d399" : "#fb7185"}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {pt.r >= 0 ? `+${pt.r}R` : `${pt.r}R`}
              </text>
              <text
                x={pt.x}
                y={height - 8}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-2">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          Setiap 1R merepresentasikan risiko modal tetap. Keuntungan bersih saat ini setara +4.49x risiko awal!
        </span>
        <span className="text-emerald-400 font-mono font-semibold">TWS Discipline Validated</span>
      </div>
    </div>
  );
}
