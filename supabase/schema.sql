-- ==============================================================================
-- TWS MASTER TRADING SYSTEM - SUPABASE POSTGRESQL SCHEMA & INITIAL SEED DATA
-- Sesuai Metodologi Trade With Suli (Sully) & Auction Market Theory (AMT)
-- ==============================================================================

-- 1. Tabel Master Rekam Jejak Trade
CREATE TABLE IF NOT EXISTS public.trades (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('LONG', 'SHORT')),
    call_date TEXT NOT NULL,
    entry_price NUMERIC NOT NULL,
    current_price NUMERIC NOT NULL,
    stop_loss NUMERIC NOT NULL,
    tp1 NUMERIC NOT NULL,
    tp2 NUMERIC NOT NULL,
    high_reached NUMERIC,
    low_reached NUMERIC,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'TP1_HIT', 'CLOSED_WIN', 'STOP_LOSS', 'PENDING_LIMIT')),
    risk_pct NUMERIC NOT NULL,
    realized_r NUMERIC NOT NULL DEFAULT 0,
    floating_r NUMERIC NOT NULL DEFAULT 0,
    total_r NUMERIC NOT NULL DEFAULT 0,
    amt_setup_type TEXT NOT NULL,
    autopsy_summary TEXT,
    autopsy_what_happened TEXT,
    autopsy_key_lesson TEXT,
    autopsy_safeguard_rule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Rezim Pasar Makro
CREATE TABLE IF NOT EXISTS public.macro_state (
    id INT PRIMARY KEY DEFAULT 1,
    regime TEXT NOT NULL CHECK (regime IN ('GREEN', 'YELLOW', 'RED')),
    btc_price NUMERIC NOT NULL,
    btc_change_24h NUMERIC NOT NULL,
    total_market_cap TEXT NOT NULL,
    notes TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macro_state ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Akses: Publik Dapat Membaca (Public Read)
CREATE POLICY  Allow public read access on trades 
    ON public.trades FOR SELECT USING (true);

CREATE POLICY Allow public read access on macro_state 
    ON public.macro_state FOR SELECT USING (true);

-- Kebijakan Akses: Anon & Authenticated dapat menulis/update
CREATE POLICY Allow insert/update access on trades 
    ON public.trades FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY Allow insert/update access on macro_state 
    ON public.macro_state FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Data Awal (4 Trade Resmi & Kondisi Makro Terkini)
INSERT INTO public.macro_state (id, regime, btc_price, btc_change_24h, total_market_cap, notes, last_updated)
VALUES (
    1,
    'YELLOW',
    76820,
    -1.79,
    '.64T',
    'Rezim Makro: DEFENSIVE / PULLBACK. BTC breakdown dari .5k menuju demand .3k. Altcoins merah terkoreksi (-4% s/d -14%). Mode simpan kas aktif.',
    '11 September 2026, 10:15 WIB'
)
ON CONFLICT (id) DO UPDATE SET
    regime = EXCLUDED.regime,
    btc_price = EXCLUDED.btc_price,
    btc_change_24h = EXCLUDED.btc_change_24h,
    total_market_cap = EXCLUDED.total_market_cap,
    notes = EXCLUDED.notes,
    last_updated = EXCLUDED.last_updated,
    updated_at = NOW();

INSERT INTO public.trades (
    id, symbol, side, call_date, entry_price, current_price, stop_loss, tp1, tp2, 
    high_reached, low_reached, status, risk_pct, realized_r, floating_r, total_r, 
    amt_setup_type, autopsy_summary, autopsy_what_happened, autopsy_key_lesson, autopsy_safeguard_rule
) VALUES
(
    'TWS-002',
    'DOT/USDT',
    'LONG',
    '8 Sep 2026',
    1.030,
    1.115,
    0.968,
    1.145,
    1.260,
    1.280,
    NULL,
    'CLOSED_WIN',
    6.02,
    3.71,
    0,
    3.71,
    'Liquidity Sweep below Support + Breakout Acceptance',
    'Kemenangan Penuh Telak (TP1 & TP2 Hit Sempurna)',
    'Harga turun menyapu likuiditas di bawah level support .030, lalu modal institusi mendorong candle impulsif vertikal menembus TP1 (.145) hingga mencetak high di .280 (+24.3%).',
    'Kesabaran menunggu sweep likuiditas memberikan entri dengan zero drawdown dan reward optimal.',
    'Posisi ditutup 100% penuh di area TP2 tanpa mengejar target spekulatif lanjutan.'
),
(
    'TWS-001',
    'NEAR/USDT',
    'LONG',
    '7 Sep 2026',
    2.278,
    2.392,
    2.278,
    2.484,
    2.756,
    2.650,
    NULL,
    'TP1_HIT',
    5.79,
    1.56,
    0.88,
    2.44,
    'Breakout Retest Acceptance + Equal Lows (EQL) Sweep',
    'TP1 Hit & Free Trade Running Menuju Final Target',
    'Limit order terjemput presisi di jarum .277 (di bawah EQL). Semalam melonjak menyapu Weak High hingga .650 (+16.3%). TP1 tercapai (+1.56R realized), 50% profit terkunci di bank, dan SL resmi dikunci di Breakeven (.278). Saat BTC dump, NEAR bertahan kuat di .39 tanpa risiko modal.',
    'Level Breakeven menghilangkan risiko psikologis trader 100% saat membiarkan sisa posisi berjalan.',
    'Stop Loss di Breakeven .278. Sisa posisi ditargetkan keluar mentok di .756.'
),
(
    'TWS-003',
    'TAO/USDT',
    'LONG',
    '9 Sep 2026',
    250.80,
    234.52,
    237.50,
    274.00,
    300.00,
    NULL,
    233.37,
    'STOP_LOSS',
    5.30,
    -1.00,
    0,
    -1.00,
    'Breakout Retest Acceptance (Matrix 4/4 Outperformer)',
    'Hit Stop Loss di .50 (-1.00R) Lindungi Modal dari Dump ke ',
    'Limit order terjemput di .80. Namun bersamaan dengan breakdown BTC dari .5k ke .3k, TAO tertekan tembus ke bawah dan menyentuh Stop Loss di .50 sebelum anjlok lebih dalam ke .37.',
    'Sistem Stop Loss bekerja 100% disiplin sesuai TWS Rule #3: Jangan pernah trading tanpa Stop Loss. Menghentikan kerugian di -1R mencegah kerugian bertambah jadi -2.5R+.',
    'Posisi ditutup disiplin di .50 (-1.00R). Modal terlindungi secara sistemik dari kejatuhan harga lebih dalam.'
),
(
    'TWS-000',
    'UNI/USDT',
    'LONG',
    '6 Sep 2026',
    7.050,
    5.989,
    6.600,
    7.480,
    8.500,
    7.480,
    NULL,
    'STOP_LOSS',
    6.38,
    -1.00,
    0,
    -1.00,
    'Consolidation Value Area Breakout',
    'Hit Stop Loss di .60 (Penyelamat Akun dari Dump ke .98)',
    'Harga sempat naik ke resistensi lokal .48 (+6.5%), namun target dipasang terlalu ambisius ke .50 tanpa mengunci Breakeven di TP1. Volume beli habis, harga berbalik menembus .60 (SL Hit) dan anjlok ke .98.',
    'Penyakit klasik round-tripping profit: keuntungan di atas kertas menguap karena tidak mengunci BE dan mengejar target halu.',
    'Melahirkan SOP baru wajib: Mentok 3R-4R & Wajib Geser Breakeven di TP1. Stop Loss di .60 menyelamatkan modal dari loss -15%.'
)
ON CONFLICT (id) DO UPDATE SET
    symbol = EXCLUDED.symbol,
    side = EXCLUDED.side,
    current_price = EXCLUDED.current_price,
    stop_loss = EXCLUDED.stop_loss,
    status = EXCLUDED.status,
    realized_r = EXCLUDED.realized_r,
    floating_r = EXCLUDED.floating_r,
    total_r = EXCLUDED.total_r,
    updated_at = NOW();
