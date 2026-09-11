export type TradeStatus = "ACTIVE" | "TP1_HIT" | "CLOSED_WIN" | "STOP_LOSS" | "PENDING_LIMIT";

export interface Trade {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  callDate: string;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number; // Final exit capped at 3-4R
  highReached?: number;
  lowReached?: number;
  status: TradeStatus;
  riskPct: number;
  realizedR: number;
  floatingR: number;
  totalR: number;
  amtSetupType: string;
  autopsy?: {
    summary: string;
    whatHappened: string;
    keyLesson: string;
    safeguardRule: string;
  };
}

export interface MacroOverview {
  regime: "GREEN" | "YELLOW" | "RED";
  btcPrice: number;
  btcChange24h: number;
  totalMarketCap: string;
  notes: string;
  lastUpdated: string;
}

export interface PortfolioStats {
  totalTrades: number;
  winRatePct: number;
  netRMultiple: number;
  maxDrawdownR: number;
  activeTradesCount: number;
  realizedRTotal: number;
  floatingRTotal: number;
}
