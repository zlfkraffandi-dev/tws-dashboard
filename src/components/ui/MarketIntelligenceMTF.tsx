"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Compass,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Maximize2,
  ChevronRight,
  Calculator,
  Activity,
  Zap,
  Clock,
  Sparkles
} from "lucide-react";

type TimeframeKey = "4H" | "1H" | "30m" | "15m";
type AssetKey = "UNI" | "SOL";

interface TFDetail {
  title: string;
  badge: string;
  badgeColor: string;
  bias: "BULLISH" | "NEUTRAL" | "BEARISH" | "CORRECTION";
  summary: string;
  keyObservation: string;
  criticalLevel: string;
  actionGuidance: string;
}

interface FibLevel {
  label: string;
  price: number;
  zone: string;
  tag: string;
  color: string;
}

export default function MarketIntelligenceMTF() {
  const [selectedAsset, setSelectedAsset] = useState<AssetKey>("UNI");
  const [selectedTF, setSelectedTF] = useState<TimeframeKey>("1H");

  const assetData: Record<
    AssetKey,
    {
      name: string;
      pair: string;
      desc: string;
      swingBasis: string;
      premiumZone: string;
      discountZone: string;
      quote: string;
      tfData: Record<TimeframeKey, TFDetail>;
      fibLevels: FibLevel[];
    }
  > = {
    UNI: {
      name: "Uniswap",
      pair: "UNI/USDT",
      desc: "Dekomposisi struktural UNI/USDT dari 4H hingga 15m pasca dump -10.8% menguji S/R Flip akumulasi dan Quadruple Bottom.",
      swingBasis: "Basis Swing $8.68 - $10.89",
      premiumZone: "🔴 Premium Zone: > $10.05",
      discountZone: "🟢 Discount Zone: < $9.34",
      quote:
        "Equilibrium ($9.78) adalah harga wajar. Penyerapan pembeli institusional agresif terakumulasi di S/R Flip Shelf ($9.05 - $9.15) dan Deep Discount ($8.90).",
      tfData: {
        "4H": {
          title: "4H Macro Market Structure (Anchor Tren)",
          badge: "Bullish Breakout & Retest",
          badgeColor: "emerald",
          bias: "BULLISH",
          summary:
            "Struktur tren makro berhasil mematahkan resistensi akumulasi 2 minggu ($8.70 - $9.15) dengan ledakan impulsif ke $10.89 (+64%). Koreksi saat ini adalah retest sehat ke atap konsolidasi lama.",
          keyObservation:
            "Swing High $10.89 (BOS). Kunci Higher Low struktural 4H berada di $8.68. Selama lelang bertahan di atas $8.68, tren makro bullish 100% terjaga.",
          criticalLevel: "Batas Pertahanan Tren: $8.68 (Invalidasi tren makro 4H)",
          actionGuidance: "Dilarang panik atau mengejar di pucuk. Cari titik antri beli saat harga terdiskon di lantai lelang."
        },
        "1H": {
          title: "1H Auction Market Theory & Value Area",
          badge: "S/R Flip Demand Shelf",
          badgeColor: "cyan",
          bias: "CORRECTION",
          summary:
            "Lelang mengalami exhaustion di Value Area High ($10.89), memicu liquidation dump retail -10.8% langsung menuju Value Area Low / S/R Flip ($9.05 - $9.20).",
          keyObservation:
            "Terjadi penyerapan likuiditas institusi (absorption) di area $9.07 - $9.20. Tidak ada candle close 1H yang diizinkan tembus di bawah $9.07.",
          criticalLevel: "S/R Flip Support: $9.05 - $9.15 | POC Atas: $10.25",
          actionGuidance:
            "Area $8.90 - $9.15 adalah batas lantai lelang terkuat. Pasang jaring pasif terlindung di zona diskon ini."
        },
        "30m": {
          title: "30m Sub-Structure & Fair Value Gap (FVG)",
          badge: "Quadruple Bottom at $9.07",
          badgeColor: "purple",
          bias: "NEUTRAL",
          summary:
            "Candle dump cepat meninggalkan Fair Value Gap (FVG) bearish di $9.60 - $9.74 yang akan bertindak sebagai magnet tarikan harga ke atas.",
          keyObservation:
            "Lantai $9.07 berhasil menahan 4 gelombang penurunan berturut-turut (quadruple tap) tanpa tembus, mengonfirmasi penyerapan likuiditas jual.",
          criticalLevel: "Magnet Tarikan Likuiditas (FVG): $9.60 - $9.74",
          actionGuidance:
            "Target TP1 di $9.90 dipasang tepat di atas FVG untuk memastikan likuiditas terserap sebelum mengambil profit."
        },
        "15m": {
          title: "15m Micro Timing & Trigger Execution",
          badge: "CHoCH Confirmed to $9.43",
          badgeColor: "emerald",
          bias: "BULLISH",
          summary:
            "Terjadi konfirmasi Change of Character (CHoCH) mikro setelah harga membentuk Higher Lows ($9.07 -> $9.16 -> $9.26) dan menembus swing high mikro ke $9.43.",
          keyObservation:
            "Volume beli mulai masuk secara bertahap saat candle 15m mencetak wick penolakan bawah yang konsisten.",
          criticalLevel: "Pivot Validasi Mikro: $9.20 (Demand mikro)",
          actionGuidance:
            "Bagi eksekusi disiplin TWS: Pasang Buy Limit jaring aman di $8.90 - $9.05 dengan Stop Loss mutlak di $8.38."
        }
      },
      fibLevels: [
        { label: "High (0.000)", price: 10.89, zone: "PREMIUM", tag: "Pucuk VAH Expansion (Exhaustion)", color: "rose" },
        { label: "Fib 0.236", price: 10.37, zone: "PREMIUM", tag: "Breaker Block / Prior Resistance", color: "rose" },
        { label: "Fib 0.382", price: 10.05, zone: "MID-EXP", tag: "Plafon Retracement", color: "amber" },
        { label: "Fib 0.500", price: 9.78, zone: "EQUILIBRIUM", tag: "Fair Value / Target Imbalance FVG", color: "cyan" },
        { label: "Fib 0.618", price: 9.52, zone: "DISCOUNT", tag: "Golden Ratio Upper Bound", color: "emerald" },
        { label: "Fib 0.700", price: 9.34, zone: "DISCOUNT", tag: "Optimal Trade Entry (Testing Now)", color: "emerald" },
        { label: "Fib 0.786", price: 9.15, zone: "DISCOUNT", tag: "S/R Flip Shelf / $9.07 Quad Bottom", color: "emerald" },
        { label: "Fib 0.886", price: 8.93, zone: "DISCOUNT", tag: "Deep Discount Limit Zone ($8.90)", color: "emerald" },
        { label: "Low (1.000)", price: 8.68, zone: "INVALID", tag: "Structural Higher Low 4H", color: "slate" }
      ]
    },
    SOL: {
      name: "Solana",
      pair: "SOL/USDT",
      desc: "Dekomposisi struktural SOL/USDT pasca Double VAH Sweep $119.50 dan flash dump BTC menuju demand shelf.",
      swingBasis: "Basis Swing $107.33 - $119.49",
      premiumZone: "🔴 Premium Zone: > $116.60",
      discountZone: "🟢 Discount Zone: < $112.50",
      quote:
        "Equilibrium ($113.41) adalah harga wajar. Pembelian institusional sesungguhnya terakumulasi di Discount Zone ($110.97 - $112.00).",
      tfData: {
        "4H": {
          title: "4H Macro Market Structure (Anchor Tren)",
          badge: "Higher Low Intact",
          badgeColor: "emerald",
          bias: "BULLISH",
          summary:
            "Struktur tren makro bullish masih 100% utuh. Koreksi kemarin adalah pullback sehat (mean reversion) menuju area demand.",
          keyObservation:
            "Swing High dicetak di $119.85. Kunci Higher Low struktural 4H berada di $107.33 (20 Sep).",
          criticalLevel: "Pertahanan Terakhir: $107.33 (Selama di atas ini, tren makro bullish aman)",
          actionGuidance: "Dilarang panik mengira bear market. Cari konfluensi beli hanya saat harga berada di area diskon."
        },
        "1H": {
          title: "1H Auction Market Theory & Value Area",
          badge: "Equilibrium 0.50 Tapped",
          badgeColor: "amber",
          bias: "CORRECTION",
          summary:
            "Double VAH Sweep di $119.50 memicu penolakan lelang ke Fair Value (Equilibrium 0.50 di $113.41) yang langsung memantul.",
          keyObservation:
            "Low menyentuh $113.34 (hanya selisih 7 sen dari Fib 0.50 $113.41). Pembeli lelang institusional menyerap likuiditas.",
          criticalLevel: "Equilibrium: $113.41 | Golden Pocket: $110.97 - $112.00",
          actionGuidance: "Setup baru wajib fokus di Discount Zone ($111.00 - $112.00)."
        },
        "30m": {
          title: "30m Sub-Structure & Fair Value Gap (FVG)",
          badge: "Liquidity Void / Imbalance",
          badgeColor: "purple",
          bias: "NEUTRAL",
          summary:
            "Candle dump impulsif meninggalkan celah likuiditas kosong (FVG) di rentang $116.00 - $116.80.",
          keyObservation:
            "Order block lama ($117.00 - $117.50) kini bertransformasi menjadi Bearish Breaker Block (Resistensi Baru).",
          criticalLevel: "Area Magnet Tarikan Pantulan: $116.00 - $116.60",
          actionGuidance:
            "Pantulan harga dari $113.34 akan tersedot ke zona FVG ini untuk mengisi ketidakefisienan lelang."
        },
        "15m": {
          title: "15m Micro Timing & Trigger Execution",
          badge: "Testing Relief Bounce",
          badgeColor: "cyan",
          bias: "NEUTRAL",
          summary:
            "Pantulan mikro dari $113.34 menuju $115.20+ sedang menguji konfirmasi Change of Character (CHoCH).",
          keyObservation:
            "Masih berstatus relief bounce sampai harga berhasil menembus dan ditutup di atas $116.62.",
          criticalLevel: "Konfirmasi Bullish Reclaim: Close di atas $116.62",
          actionGuidance: "Tunggu sweep ke diskon $111.20 ATAU tunggu konfirmasi di atas $116.62."
        }
      },
      fibLevels: [
        { label: "High (0.000)", price: 119.49, zone: "PREMIUM", tag: "Double VAH Sweep (Trap)", color: "rose" },
        { label: "Fib 0.236", price: 116.62, zone: "PREMIUM", tag: "Breaker Block / FVG Ceiling", color: "rose" },
        { label: "Fib 0.382", price: 114.85, zone: "MID-EXP", tag: "Area Cutloss Disiplin -1R", color: "amber" },
        { label: "Fib 0.500", price: 113.41, zone: "EQUILIBRIUM", tag: "Fair Value (Titik Pantul $113.34)", color: "cyan" },
        { label: "Fib 0.618", price: 112.00, zone: "DISCOUNT", tag: "Golden Ratio / Smart Money Pocket", color: "emerald" },
        { label: "Fib 0.700", price: 110.97, zone: "DISCOUNT", tag: "Optimal Trade Entry (OTE)", color: "emerald" },
        { label: "Low (1.000)", price: 107.33, zone: "INVALID", tag: "Structural Higher Low 4H", color: "slate" }
      ]
    }
  };

  const active = assetData[selectedAsset];
  const current = active.tfData[selectedTF];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              TWS Market Intelligence & MTF Deep Radar
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20 font-mono">
                Multi-Timeframe Engine (4H - 15m)
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{active.desc}</p>
        </div>

        {/* Controls: Asset Selector + Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Asset Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            {(["UNI", "SOL"] as AssetKey[]).map((asset) => {
              const isSelected = selectedAsset === asset;
              return (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{asset}/USDT</span>
                  {asset === "UNI" && (
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1 py-0.2 rounded font-sans">
                      Champion
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            {(["4H", "1H", "30m", "15m"] as TimeframeKey[]).map((tf) => {
              const isSelected = selectedTF === tf;
              return (
                <button
                  key={tf}
                  onClick={() => setSelectedTF(tf)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Analysis Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Timeframe Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedAsset}-${selectedTF}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {active.pair} • Timeframe {selectedTF} Focus
                  </span>
                  <h4 className="text-sm font-bold text-slate-200 mt-0.5">{current.title}</h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold font-mono border ${
                    current.bias === "BULLISH"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : current.bias === "CORRECTION"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  }`}
                >
                  {current.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                {current.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-900/40 p-3 border border-slate-800/60 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-cyan-400" /> Observasi Kunci
                  </div>
                  <p className="text-slate-300 leading-normal text-[11px]">{current.keyObservation}</p>
                </div>

                <div className="rounded-lg bg-slate-900/40 p-3 border border-slate-800/60 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-400" /> Level Kritis
                  </div>
                  <p className="font-mono text-amber-300 text-[11px] font-semibold">{current.criticalLevel}</p>
                </div>
              </div>

              <div className="rounded-lg bg-cyan-950/20 border border-cyan-500/20 p-3 text-xs text-cyan-300 flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-200">SOP Taktikal: </span>
                  {current.actionGuidance}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Institutional Discipline Alert Box */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold font-mono">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              SOP Konfluensi Multitimeframe (4H, 1H, 30m, 15m)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dilarang mengeksekusi posisi hanya berdasarkan 1 timeframe. Sinyal dinyatakan valid (Grade A+) hanya jika
              <strong className="text-slate-200"> 4H (Arah Makro)</strong>,{" "}
              <strong className="text-slate-200">1H (Value Area S/R Flip)</strong>,{" "}
              <strong className="text-slate-200">30m (Celah Likuiditas FVG)</strong>, dan{" "}
              <strong className="text-slate-200">15m (Konfirmasi CHoCH)</strong> saling berkonfluensi searah.
            </p>
          </div>
        </div>

        {/* Right Column: Fibonacci Price Ladder Tool (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-mono text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Calculator className="h-3.5 w-3.5 text-emerald-400" /> Tangga Fibonacci {active.pair}
            </h4>
            <span className="text-[10px] font-mono text-slate-500">{active.swingBasis}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
            <div className="space-y-1.5">
              {active.fibLevels.map((lvl) => (
                <div
                  key={lvl.label}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all border ${
                    lvl.color === "emerald"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                      : lvl.color === "cyan"
                      ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-200 shadow-sm"
                      : lvl.color === "amber"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                      : lvl.color === "rose"
                      ? "bg-rose-950/20 border-rose-500/20 text-rose-300"
                      : "bg-slate-900/40 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[11px] w-20">{lvl.label}</span>
                    <span className="font-bold text-slate-100">${lvl.price.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-current font-sans font-medium line-clamp-1">
                      {lvl.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold font-mono">
                <span>{active.premiumZone}</span>
                <span>{active.discountZone}</span>
              </div>
              <p>{active.quote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
