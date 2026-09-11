import { Trade, MacroOverview, PortfolioStats } from "@/types/trade";

export const initialMacro: MacroOverview = {
  regime: "YELLOW",
  btcPrice: 76820,
  btcChange24h: -1.79,
  totalMarketCap: "$2.64T",
  notes: "Rezim Makro: DEFENSIVE / PULLBACK. BTC breakdown dari $78.5k menuju lantai demand $76.3k. Altcoins merah terkoreksi (-4% s/d -14%). Mode simpan kas aktif.",
  lastUpdated: "11 September 2026, 10:15 WIB"
};

export const initialTrades: Trade[] = [
  {
    id: "TWS-002",
    symbol: "DOT/USDT",
    side: "LONG",
    callDate: "8 Sep 2026",
    entryPrice: 1.030,
    currentPrice: 1.115,
    stopLoss: 0.968,
    tp1: 1.145,
    tp2: 1.260,
    highReached: 1.280,
    status: "CLOSED_WIN",
    riskPct: 6.02,
    realizedR: 3.71,
    floatingR: 0,
    totalR: 3.71,
    amtSetupType: "Liquidity Sweep below Support + Breakout Acceptance",
    autopsy: {
      summary: "Kemenangan Penuh Telak (TP1 & TP2 Hit Sempurna)",
      whatHappened: "Harga turun menyapu likuiditas di bawah level support $1.030, lalu modal institusi mendorong candle impulsif vertikal menembus TP1 ($1.145) hingga mencetak high di $1.280 (+24.3%).",
      keyLesson: "Kesabaran menunggu sweep likuiditas memberikan entri dengan zero drawdown dan reward optimal.",
      safeguardRule: "Posisi ditutup 100% penuh di area TP2 tanpa mengejar target spekulatif lanjutan."
    }
  },
  {
    id: "TWS-001",
    symbol: "NEAR/USDT",
    side: "LONG",
    callDate: "7 Sep 2026",
    entryPrice: 2.278,
    currentPrice: 2.392,
    stopLoss: 2.278, // Moved to Breakeven
    tp1: 2.484,
    tp2: 2.756,
    highReached: 2.650,
    status: "TP1_HIT",
    riskPct: 5.79,
    realizedR: 1.56,
    floatingR: 0.88,
    totalR: 2.44,
    amtSetupType: "Breakout Retest Acceptance + Equal Lows (EQL) Sweep",
    autopsy: {
      summary: "TP1 Hit & Free Trade Running Menuju Final Target",
      whatHappened: "Limit order terjemput presisi di jarum $2.277 (di bawah EQL). Semalam melonjak menyapu Weak High hingga $2.650 (+16.3%). TP1 tercapai (+1.56R realized), 50% profit terkunci di bank, dan SL resmi dikunci di Breakeven ($2.278). Saat BTC dump, NEAR bertahan kuat di $2.39 tanpa risiko modal.",
      keyLesson: "Level Breakeven menghilangkan risiko psikologis trader 100% saat membiarkan sisa posisi berjalan.",
      safeguardRule: "Stop Loss di Breakeven $2.278. Sisa posisi ditargetkan keluar mentok di $2.756."
    }
  },
  {
    id: "TWS-003",
    symbol: "TAO/USDT",
    side: "LONG",
    callDate: "9 Sep 2026",
    entryPrice: 250.80,
    currentPrice: 234.52,
    stopLoss: 237.50,
    tp1: 274.00,
    tp2: 300.00,
    lowReached: 233.37,
    status: "STOP_LOSS",
    riskPct: 5.30,
    realizedR: -1.00,
    floatingR: 0,
    totalR: -1.00,
    amtSetupType: "Breakout Retest Acceptance (Matrix 4/4 Outperformer)",
    autopsy: {
      summary: "Hit Stop Loss di $237.50 (-1.00R) Lindungi Modal dari Dump ke $233",
      whatHappened: "Limit order terjemput di $250.80. Namun bersamaan dengan breakdown BTC dari $78.5k ke $76.3k, TAO tertekan tembus ke bawah dan menyentuh Stop Loss di $237.50 sebelum anjlok lebih dalam ke $233.37.",
      keyLesson: "Sistem Stop Loss bekerja 100% disiplin sesuai TWS Rule #3: 'Jangan pernah trading tanpa Stop Loss'. Menghentikan kerugian di -1R mencegah kerugian bertambah jadi -2.5R+.",
      safeguardRule: "Posisi ditutup disiplin di $237.50 (-1.00R). Modal terlindungi secara sistemik dari kejatuhan harga lebih dalam."
    }
  },
  {
    id: "TWS-000",
    symbol: "UNI/USDT",
    side: "LONG",
    callDate: "6 Sep 2026",
    entryPrice: 7.050,
    currentPrice: 5.989,
    stopLoss: 6.600,
    tp1: 7.480,
    tp2: 8.500,
    highReached: 7.480,
    status: "STOP_LOSS",
    riskPct: 6.38,
    realizedR: -1.00,
    floatingR: 0,
    totalR: -1.00,
    amtSetupType: "Consolidation Value Area Breakout",
    autopsy: {
      summary: "Hit Stop Loss di $6.60 (Penyelamat Akun dari Dump ke $5.98)",
      whatHappened: "Harga sempat naik ke resistensi lokal $7.48 (+6.5%), namun target dipasang terlalu ambisius ke $8.50 tanpa mengunci Breakeven di TP1. Volume beli habis, harga berbalik menembus $6.60 (SL Hit) dan anjlok ke $5.98.",
      keyLesson: "Penyakit klasik round-tripping profit: keuntungan di atas kertas menguap karena tidak mengunci BE dan mengejar target halu.",
      safeguardRule: "Melahirkan SOP baru wajib: 'Mentok 3R-4R & Wajib Geser Breakeven di TP1'. Stop Loss di $6.60 menyelamatkan modal dari loss -15%."
    }
  }
];

export const initialStats: PortfolioStats = {
  totalTrades: 4,
  winRatePct: 50.0,
  netRMultiple: 3.27,
  maxDrawdownR: 1.00,
  activeTradesCount: 1,
  realizedRTotal: 3.27,
  floatingRTotal: 0.88
};
