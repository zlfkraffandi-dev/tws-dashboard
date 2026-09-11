"use client";

import React from "react";
import { useTradeStore } from "@/stores/useTradeStore";
import { motion } from "framer-motion";
import { TrendingUp, Target, ShieldAlert, Award } from "lucide-react";

export default function HeroScoreboard() {
  const { stats } = useTradeStore();

  const cards = [
    {
      title: "Net Accumulated R-Multiple",
      value: `+${stats.netRMultiple.toFixed(2)}R`,
      sub: `Realized: +${stats.realizedRTotal.toFixed(2)}R � Floating: +${stats.floatingRTotal.toFixed(2)}R`,
      badge: "Portofolio Surplus",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      icon: TrendingUp,
      accent: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      valueColor: "text-emerald-400",
    },
    {
      title: "Directional Win Rate",
      value: `${stats.winRatePct.toFixed(1)}%`,
      sub: "2 Menang Penuh (DOT, NEAR) • 2 Cut SL (UNI, TAO)",
      badge: "Realistis & Jujur",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      icon: Target,
      accent: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      valueColor: "text-cyan-300",
    },
    {
      title: "Max Drawdown Terkendali",
      value: `-${stats.maxDrawdownR.toFixed(2)}R`,
      sub: "Disiplin SL -1R cegah kerugian bertambah dalam",
      badge: "Risiko Terkunci",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      icon: ShieldAlert,
      accent: "from-rose-500/10 via-rose-500/5 to-transparent",
      valueColor: "text-rose-400",
    },
    {
      title: "Target Ceiling Disiplin",
      value: "3R � 4R",
      sub: "SOP Kaku: Tutup 100% di TP2 (Dilarang Serakah)",
      badge: "Anti Round-Trip",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      icon: Award,
      accent: "from-purple-500/10 via-purple-500/5 to-transparent",
      valueColor: "text-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg transition-all hover:border-slate-700"
          >
            {/* Top gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-b ${card.accent} pointer-events-none opacity-50`} />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                  {card.title}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              <div>
                <div className={`text-3xl font-extrabold font-mono tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
                <p className="mt-1 text-xs text-slate-400 font-sans line-clamp-1">
                  {card.sub}
                </p>
              </div>

              {/* Miniature footer indicator */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Evaluasi TWS Disiplin</span>
                <Icon className="h-3.5 w-3.5 opacity-60" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
