import AmbientParticles from "@/components/canvas/AmbientParticles";
import Header from "@/components/ui/Header";
import HeroScoreboard from "@/components/ui/HeroScoreboard";
import ActivePositions from "@/components/ui/ActivePositions";
import TradingViewWidget from "@/components/ui/TradingViewWidget";
import EquityCurveChart from "@/components/ui/EquityCurveChart";
import TradeLedgerTable from "@/components/ui/TradeLedgerTable";
import AutopsyModal from "@/components/ui/AutopsyModal";
import PriceAutoStreamer from "@/components/ui/PriceAutoStreamer";
import { ShieldCheck, Zap, Terminal } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between">
      {/* Background auto price polling streamer */}
      <PriceAutoStreamer />

      {/* 3D / Canvas background */}
      <AmbientParticles />

      {/* Main UI Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation & Header */}
        <Header />

        {/* Full-width Dashboard Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
          {/* Hero Scoreboard Row */}
          <HeroScoreboard />

          {/* Live Active Positions */}
          <ActivePositions />

          {/* Embedded Interactive TradingView Chart */}
          <TradingViewWidget />

          {/* Equity Growth Curve */}
          <EquityCurveChart />

          {/* Master Trade Ledger & Autopsy */}
          <TradeLedgerTable />
        </div>

        {/* Modal Drawer for Autopsy */}
        <AutopsyModal />

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-4 mt-8 text-xs text-slate-500">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>TWS Methodology (Trade With Suli) - Auction Market Theory (AMT)</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Disiplin Mentok 3R-4R
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                Anti Round-Trip Profit
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
