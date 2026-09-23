import { create } from "zustand";
import { Trade, MacroOverview, PortfolioStats, TradeStatus } from "@/types/trade";
import { initialTrades, initialMacro, initialStats } from "@/data/initialTrades";

interface TradeStore {
  trades: Trade[];
  macro: MacroOverview;
  stats: PortfolioStats;
  filterStatus: "ALL" | TradeStatus;
  searchQuery: string;
  selectedTrade: Trade | null;
  isLoading: boolean;
  lastSynced: string;
  
  // Actions
  setFilterStatus: (status: "ALL" | TradeStatus) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTrade: (trade: Trade | null) => void;
  exportToCsv: () => void;
  refreshPrices: () => Promise<void>;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: initialTrades,
  macro: initialMacro,
  stats: initialStats,
  filterStatus: "ALL",
  searchQuery: "",
  selectedTrade: null,
  isLoading: false,
  lastSynced: "Live",

  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTrade: (trade) => set({ selectedTrade: trade }),

  exportToCsv: () => {
    const { trades } = get();
    const headers = [
      "ID",
      "Symbol",
      "Direction",
      "Call Date",
      "Entry Price ($)",
      "Current Price ($)",
      "Stop Loss ($)",
      "TP1 ($)",
      "TP2 / Final ($)",
      "Status",
      "Risk %",
      "Realized R",
      "Floating R",
      "Total R",
      "AMT Setup Type",
      "Autopsy Summary"
    ];

    const rows = trades.map((t) => [
      t.id,
      t.symbol,
      t.side,
      `"${t.callDate}"`,
      t.entryPrice,
      t.currentPrice,
      t.stopLoss,
      t.tp1,
      t.tp2,
      t.status,
      `${t.riskPct}%`,
      `${t.realizedR}R`,
      `${t.floatingR}R`,
      `${t.totalR}R`,
      `"${t.amtSetupType}"`,
      `"${t.autopsy ? t.autopsy.summary : ""}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tws_trade_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  refreshPrices: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/prices");
      const json = await res.json();
      if (json.success && json.prices) {
        const p = json.prices;
        const currentTrades = get().trades;
        const updatedTrades = currentTrades.map((trade) => {
          let updatedPrice = trade.currentPrice;
          if (trade.symbol.includes("SOL") && p.solana) updatedPrice = p.solana.price;
          if (trade.symbol.includes("SUI") && p.sui) updatedPrice = p.sui.price;
          if (trade.symbol.includes("NEAR") && p.near) updatedPrice = p.near.price;
          if (trade.symbol.includes("TAO") && p.bittensor) updatedPrice = p.bittensor.price;
          if (trade.symbol.includes("DOT") && p.polkadot) updatedPrice = p.polkadot.price;
          if (trade.symbol.includes("UNI") && p.uniswap) updatedPrice = p.uniswap.price;

          let floatingR = trade.floatingR;
          let totalR = trade.totalR;
          if (trade.status === "ACTIVE") {
            const rDistance = Math.abs(trade.entryPrice - trade.stopLoss);
            floatingR = parseFloat(((updatedPrice - trade.entryPrice) / rDistance).toFixed(2));
            totalR = floatingR;
          } else if (trade.status === "TP1_HIT") {
            const rDistance = Math.abs(trade.entryPrice - 2.146);
            const sisaR = (updatedPrice - trade.entryPrice) / rDistance;
            floatingR = parseFloat((sisaR * 0.5).toFixed(2));
            totalR = parseFloat((trade.realizedR + floatingR).toFixed(2));
          }

          return {
            ...trade,
            currentPrice: updatedPrice,
            floatingR,
            totalR,
          };
        });

        const realizedR = updatedTrades.reduce((acc, t) => acc + (t.status === "STOP_LOSS" ? -1 : t.realizedR), 0);
        const floatingRTotal = updatedTrades.reduce((acc, t) => acc + t.floatingR, 0);
        const netR = parseFloat((realizedR + floatingRTotal).toFixed(2));

        set({
          trades: updatedTrades,
          macro: {
            ...get().macro,
            btcPrice: p.bitcoin?.price || get().macro.btcPrice,
            btcChange24h: p.bitcoin?.change24h || get().macro.btcChange24h,
            lastUpdated: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
          },
          stats: {
            ...get().stats,
            netRMultiple: netR,
            floatingRTotal: parseFloat(floatingRTotal.toFixed(2)),
            realizedRTotal: parseFloat(realizedR.toFixed(2))
          },
          lastSynced: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          isLoading: false
        });
      }
    } catch {
      set({ isLoading: false });
    }
  }
}));
