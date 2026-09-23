# 📓 TWS MASTER TRADING JOURNAL & SCOREBOARD

Dokumen ini adalah single source of truth untuk seluruh rekam jejak, histori posisi, dan kalkulasi performa portofolio berdasar metodologi **Trade With Sully (TWS / Levels 1–4)** dan **Auction Market Theory (AMT)**.

---

## 🏆 SCOREBOARD RESMI
* **Total Closed Trades**: 6 Trades (2 Wins, 4 Losses)
* **Pending / Active Trades**: **0 Setup (100% Kas Bersih / Zero Exposure)**
* **Win Rate**: **33.3% Realized**
* **Net Realized Profit**: **+2.17R Net Surplus** 🚀
* **Max Drawdown Terkendali**: **-1.00R (Disiplin Terkunci)**
* **Expectancy Matematika Sully**:
  $$E = (33.3\% \times +3.08R) - (66.7\% \times 1.00R) = \mathbf{+0.36R \text{ per trade}}$$

---

## 📋 HISTORI LENGKAP 6 TRADE SELESAI
1. 🥇 **DOT/USDT (Trade #002)**: Full Winner (**+3.71R Net**). Entry $1.030, TP1 $1.145, TP2 $1.260 smashed, peaked at $1.280 (+24.3%).
2. 🥇 **NEAR/USDT (Trade #001)**: Full Winner (**+2.46R Net**). Entry $2.278, TP1 $2.484, TP2 $2.720 smashed, peaked at $2.726! (Lanjutan tren meledak hingga $4.588!).
3. 🔴 **TAO/USDT (Trade #003)**: SL Hit (**-1.00R**). SL di $237.50 menyelamatkan dari dump dalam ke $230.01.
4. 🔴 **UNI/USDT (Trade #000)**: SL Hit (**-1.00R**). Pelajaran awal: wajib lock Breakeven di TP1 dan batasi target di 3R–4R.
5. 🔴 **SUI/USDT (Trade #004)**: SL Hit (**-1.00R**). Terkena liquidity drain U.S. Corporate Tax 15 Sep (22M sell volume) sebelum rebound pasca-FOMC. Stop Loss $0.6850 memotong resiko disiplin.
6. 🔴 **SOL/USDT (Trade #005)**: SL Hit (**-1.00R**). 23 Sep 2026. Entry $117.50, SL $114.50. Terkena sapuan likuiditas pucuk (Double VAH Sweep $119.50) dan flash dump BTC dari $87.4k ke $84.0k. Stop Loss di $114.50 menyelamatkan portofolio dari anjlok lebih dalam ke $113.34.

---

## 🛡️ ATURAN BAKU SISTEM & EVALUASI LAPANGAN (KNOWLEDGE BASE)

### A. Aturan Eksekusi Disiplin TWS
1. **Never Trade Without Stop Loss**: Resiko maksimal selalu terkunci di -1.00R.
2. **Kunci Breakeven (BE) di TP1**: Begitu target 1 (+1.5R s/d +2.0R) tersentuh, geser SL ke titik masuk. Posisi 100% bebas resiko.
3. **Target Mentok 3R – 4R**: Dilarang serakah membiarkan profit menguap menjadi loss (*anti round-tripping*).
4. **Bilateral Execution**: Siap eksekusi LONG (di lantai diskon VAL/demand) maupun SHORT (di atap premium VAH/bearish OB).
5. **Simpan Kas di Tengah Lelang (POC/Chop/Weekend)**: Jangan pernah membuka posisi di tengah lelang atau mengejar harga di pucuk parabola.

### B. Evaluasi & SOP Baru (Kasus SOL 23 Sep)
1. **Filter VAH Sweep vs True Breakout**:
   * Jika pada time frame 1H muncul tanda **`VAH Sweep` (panah merah / rejection di pucuk)** dan gagal membuat candle acceptance, **DILARANG KERAS** memasang limit buy di Fib dangkal (0.236–0.382 / atap Order Block).
   * Pasar otomatis bergeser dari "Trend Expansion" menjadi "Range Retracement to Value". Order wajib dipindahkan ke **Equilibrium 0.50 ($113.40)** atau **Golden Pocket 0.618–0.70 ($111.00)**.
2. **Hukum Gravitasi BTC (The King's Veto)**:
   * Dilarang membuka posisi Long agresif pada altcoin ketika BTC sedang mengetuk level resistensi psikologis ATH / multi-month resistance (seperti $87k–$88k) dan rawan *long liquidation cascade*.
3. **Arsitektur Cloud-Native (Zero Local Reliance)**:
   * Seluruh sistem pemantauan harga dan pengiriman notifikasi harus berjalan 100% di cloud 24/7 (Vercel + Supabase + cron-job.org + Bybit API). Tidak boleh ada logika kritis yang bergantung pada PC/laptop lokal.
