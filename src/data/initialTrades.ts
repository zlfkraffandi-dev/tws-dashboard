import { Trade, MacroOverview, PortfolioStats } from "@/types/trade";

export const initialMacro: MacroOverview = {
  regime: "GREEN",
  btcPrice: 86470,
  btcChange24h: 3.82,
  totalMarketCap: "$3.12T",
  notes: "Rezim Makro: EXPANSION / INSTITUTIONAL INFLOW. Rekor ETF Inflow harian +$999 Juta USD. SOL mengonfirmasi Breakout Equal Highs $117.95, Jaring Limit aktif di $117.50 (Target +4.17R / R:R 1:4.17).",
  lastUpdated: "23 September 2026, 11:51 WIB"
};

export const initialTrades: Trade[] = [
  {
    id: "TWS-005",
    symbol: "SOL/USDT",
    side: "LONG",
    callDate: "23 Sep 2026",
    entryPrice: 117.50,
    currentPrice: 113.68,
    stopLoss: 114.50,
    tp1: 123.50,
    tp2: 130.00,
    highReached: 119.72,
    lowReached: 113.55,
    status: "STOP_LOSS",
    riskPct: 2.55,
    realizedR: -1.00,
    floatingR: 0,
    totalR: -1.00,
    amtSetupType: "Breakout Equal Highs $117.95 + Retest 1H Order Block + Fib 0.236",
    autopsy: {
      summary: "Hit Stop Loss di $114.50 (Proteksi Modal Disiplin saat Dump $113.55)",
      whatHappened: "Harga SOL terkoreksi tajam menembus limit $117.50 dan menyentuh Stop Loss di $114.50, lalu terus anjlok ke $113.55. Sistem memotong kerugian tepat di -1.00R.",
      keyLesson: "Disiplin SL -1R adalah polis asuransi mutlak: membatasi kerugian saat dump ke $113 menjaga portofolio tetap surplus bersih.",
      safeguardRule: "Posisi ditutup disiplin di $114.50 (-1.00R). Akun kembali 100% kas bersih."
    }
  },
  {
    id: "TWS-004",
    symbol: "SUI/USDT",
    side: "LONG",
    callDate: "14 Sep 2026",
    entryPrice: 0.705,
    currentPrice: 0.718,
    stopLoss: 0.685,
    tp1: 0.742,
    tp2: 0.780,
    highReached: 0.747,
    lowReached: 0.671,
    status: "STOP_LOSS",
    riskPct: 2.83,
    realizedR: -1.00,
    floatingR: 0,
    totalR: -1.00,
    amtSetupType: "Double VAL Sweep + Range Low Reclaim (POC Retest)",
    autopsy: {
      summary: "Hit Stop Loss di $0.685 (Penyelamat Modal Saat Dump $0.671)",
      whatHappened: "Pada malam 15 Sep, penarikan likuiditas pajak AS (Tax Deadline) memicu volume jual masif 22M SUI yang membanting harga menembus limit $0.705 hingga low $0.6712. Stop loss di $0.6850 mengeksekusi cutloss otomatis di -1.00R.",
      keyLesson: "Sistem Stop Loss adalah polis asuransi mutlak: membatasi kerugian di -1.00R menjaga akun tetap surplus +3.17R.",
      safeguardRule: "Posisi ditutup disiplin di $0.685 (-1.00R). Akun kembali 100% kas bersih."
    }
  },
  {
    id: "TWS-002",
    symbol: "DOT/USDT",
    side: "LONG",
    callDate: "8 Sep 2026",
    entryPrice: 1.030,
    currentPrice: 1.063,
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
    currentPrice: 2.574,
    stopLoss: 2.278,
    tp1: 2.484,
    tp2: 2.756,
    highReached: 2.726,
    status: "CLOSED_WIN",
    riskPct: 5.79,
    realizedR: 2.46,
    floatingR: 0,
    totalR: 2.46,
    amtSetupType: "Breakout Retest Acceptance + Equal Lows (EQL) Sweep",
    autopsy: {
      summary: "Kemenangan Penuh Sempurna (TP1 & TP2 Hit Maksimal)",
      whatHappened: "Limit order terjemput di $2.277. Kenaikan melesat ke $2.650 (TP1 Hit, 50% profit aman). Pada malam 11 Sep saat BTC melonjak ke $79.9k, NEAR melesat menembus target akhir di $2.726 (+19.4%). Seluruh sisa muatan ditutup tepat di TP2 sebelum harga kembali terkoreksi ke $2.57.",
      keyLesson: "Prinsip 'Mentok 3R-4R dan dilarang serakah' terbukti menyelamatkan profit dari round-tripping saat pasar bergejolak tajam.",
      safeguardRule: "Posisi ditutup 100% penuh di $2.720 (+2.46R Net). Akun kembali 100% kas bersih."
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
  totalTrades: 5,
  winRatePct: 40.0,
  netRMultiple: 3.17,
  maxDrawdownR: 1.00,
  activeTradesCount: 0,
  realizedRTotal: 3.17,
  floatingRTotal: 0
};
