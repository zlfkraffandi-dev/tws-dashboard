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
DROP POLICY IF EXISTS "Allow public read access on trades" ON public.trades;
CREATE POLICY "Allow public read access on trades" 
    ON public.trades FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on macro_state" ON public.macro_state;
CREATE POLICY "Allow public read access on macro_state" 
    ON public.macro_state FOR SELECT USING (true);

-- Kebijakan Akses: Insert/Update
DROP POLICY IF EXISTS "Allow insert/update access on trades" ON public.trades;
CREATE POLICY "Allow insert/update access on trades" 
    ON public.trades FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow insert/update access on macro_state" ON public.macro_state;
CREATE POLICY "Allow insert/update access on macro_state" 
    ON public.macro_state FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Data Awal Makro (Rabu, 23 Sep 2026)
INSERT INTO public.macro_state (id, regime, btc_price, btc_change_24h, total_market_cap, notes, last_updated)
VALUES (
    1,
    'GREEN',
    86470,
    3.82,
    '$3.12T',
    'Rezim Makro: EXPANSION / INSTITUTIONAL INFLOW. Rekor ETF Inflow harian +$999 Juta USD. SOL mengonfirmasi Breakout Equal Highs $117.95, Jaring Limit aktif di $117.50 (Target +4.17R / R:R 1:4.17).',
    '23 September 2026, 12:00 WIB'
)
ON CONFLICT (id) DO UPDATE SET
    regime = EXCLUDED.regime,
    btc_price = EXCLUDED.btc_price,
    btc_change_24h = EXCLUDED.btc_change_24h,
    total_market_cap = EXCLUDED.total_market_cap,
    notes = EXCLUDED.notes,
    last_updated = EXCLUDED.last_updated,
    updated_at = NOW();

-- 6. Seed Data Lengkap 6 Trade TWS
INSERT INTO public.trades (
    id, symbol, side, call_date, entry_price, current_price, stop_loss, tp1, tp2, 
    high_reached, low_reached, status, risk_pct, realized_r, floating_r, total_r, 
    amt_setup_type, autopsy_summary, autopsy_what_happened, autopsy_key_lesson, autopsy_safeguard_rule
) VALUES
(
    'TWS-005',
    'SOL/USDT',
    'LONG',
    '23 Sep 2026',
    117.50,
    119.52,
    114.50,
    123.50,
    130.00,
    119.72,
    NULL,
    'PENDING_LIMIT',
    2.55,
    0,
    0,
    0,
    'Breakout Equal Highs $117.95 + Retest 1H Order Block + Fib 0.236',
    'Jaring Limit Terpasang di $117.50 (Menunggu Pullback Retest)',
    'SOL memecahkan resistensi Equal Highs $117.95 dengan Break of Structure impulsif ke $119.72. Jaring limit dipasang di atap 1H Order Block $117.50 untuk mengantisipasi retest sehat sebelum ekspansi ke $130.',
    'SOP TWS: Dilarang FOMO mengejar candle hijau di pucuk lelang. Menunggu retest ke zona demand memberikan rasio Risk-to-Reward optimal 1:4.17.',
    'Jika terjemput, wajib amankan 50% di TP1 ($123.50) dan kunci Stop Loss ke Breakeven ($117.50).'
),
(
    'TWS-004',
    'SUI/USDT',
    'LONG',
    '14 Sep 2026',
    0.705,
    0.718,
    0.685,
    0.742,
    0.780,
    0.747,
    0.671,
    'STOP_LOSS',
    2.83,
    -1.00,
    0,
    -1.00,
    'Double VAL Sweep + Range Low Reclaim (POC Retest)',
    'Hit Stop Loss di $0.685 (Penyelamat Modal Saat Dump $0.671)',
    'Pada malam 15 Sep, penarikan likuiditas pajak AS (Tax Deadline) memicu volume jual masif 22M SUI yang membanting harga menembus limit $0.705 hingga low $0.6712. Stop loss di $0.6850 mengeksekusi cutloss otomatis di -1.00R.',
    'Sistem Stop Loss adalah polis asuransi mutlak: membatasi kerugian di -1.00R menjaga akun tetap surplus +3.17R.',
    'Posisi ditutup disiplin di $0.685 (-1.00R). Akun kembali 100% kas bersih.'
),
(
    'TWS-002',
    'DOT/USDT',
    'LONG',
    '8 Sep 2026',
    1.030,
    1.063,
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
    'Harga turun menyapu likuiditas di bawah level support $1.030, lalu modal institusi mendorong candle impulsif vertikal menembus TP1 ($1.145) hingga mencetak high di $1.280 (+24.3%).',
    'Kesabaran menunggu sweep likuiditas memberikan entri dengan zero drawdown dan reward optimal.',
    'Posisi ditutup 100% penuh di area TP2 tanpa mengejar target spekulatif lanjutan.'
),
(
    'TWS-001',
    'NEAR/USDT',
    'LONG',
    '7 Sep 2026',
    2.278,
    2.574,
    2.278,
    2.484,
    2.756,
    2.726,
    NULL,
    'CLOSED_WIN',
    5.79,
    2.46,
    0,
    2.46,
    'Breakout Retest Acceptance + Equal Lows (EQL) Sweep',
    'Kemenangan Penuh Sempurna (TP1 & TP2 Hit Maksimal)',
    'Limit order terjemput di $2.277. Kenaikan melesat ke $2.650 (TP1 Hit, 50% profit aman). Pada malam 11 Sep saat BTC melonjak ke $79.9k, NEAR melesat menembus target akhir di $2.726 (+19.4%). Seluruh sisa muatan ditutup tepat di TP2 sebelum harga kembali terkoreksi ke $2.57.',
    'Prinsip Mentok 3R-4R dan dilarang serakah terbukti menyelamatkan profit dari round-tripping saat pasar bergejolak tajam.',
    'Posisi ditutup 100% penuh di $2.720 (+2.46R Net). Akun kembali 100% kas bersih.'
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
    'Hit Stop Loss di $237.50 (-1.00R) Lindungi Modal dari Dump ke $233',
    'Limit order terjemput di $250.80. Namun bersamaan dengan breakdown BTC dari $78.5k ke $76.3k, TAO tertekan tembus ke bawah dan menyentuh Stop Loss di $237.50 sebelum anjlok lebih dalam ke $233.37.',
    'Sistem Stop Loss bekerja 100% disiplin sesuai TWS Rule #3: Jangan pernah trading tanpa Stop Loss. Menghentikan kerugian di -1R mencegah kerugian bertambah jadi -2.5R+.',
    'Posisi ditutup disiplin di $237.50 (-1.00R). Modal terlindungi secara sistemik dari kejatuhan harga lebih dalam.'
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
    'Hit Stop Loss di $6.60 (Penyelamat Akun dari Dump ke $5.98)',
    'Harga sempat naik ke resistensi lokal $7.48 (+6.5%), namun target dipasang terlalu ambisius ke $8.50 tanpa mengunci Breakeven di TP1. Volume beli habis, harga berbalik menembus $6.60 (SL Hit) dan anjlok ke $5.98.',
    'Penyakit klasik round-tripping profit: keuntungan di atas kertas menguap karena tidak mengunci BE dan mengejar target halu.',
    'Melahirkan SOP baru wajib: Mentok 3R-4R & Wajib Geser Breakeven di TP1. Stop Loss di $6.60 menyelamatkan modal dari loss -15%.'
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
