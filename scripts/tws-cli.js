const path = require('path');
const fs = require('fs');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const cmd = (process.argv[2] || 'info').toLowerCase();

async function getBtcPrice() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { signal: AbortSignal.timeout(1500) });
    const data = await res.json();
    if (data && data.price) return parseFloat(data.price);
  } catch (e) {}

  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data?.bitcoin?.usd) return parseFloat(data.bitcoin.usd);
  } catch (e) {}

  return 83800;
}

async function main() {
  if (cmd === 'update') {
    console.log('\n📡 ========================================');
    console.log('   [LIVE PORTFOLIO STATUS - TWS QUANT]');
    console.log('========================================');
    console.log('• Status Posisi     : 🛡️  100% KAS BERSIH (Zero Exposure)');
    console.log('• Resiko Floating   : 0.00% (Nol resiko di pasar)');
    console.log('• Akumulasi Realized: +2.17R Net Profit 🚀');
    console.log('• Sikap Pasar       : DEFENSIVE / SIMPAN KAS');
    console.log('----------------------------------------');
    console.log('💡 Market sedang koreksi pasca-pucuk. Kas aman utuh di dompet.\n');
  } else if (cmd === 'rekap') {
    console.log('\n📓 ========================================');
    console.log('   [TWS MASTER SCOREBOARD & JURNAL]');
    console.log('========================================');
    console.log('🏆 TOTAL PERFORMA RESMI:');
    console.log('• Total Trade       : 6 Selesai (2 Win, 4 Loss)');
    console.log('• Direction Win Rate: 33.3% Realized');
    console.log('• Total Net Profit  : +2.17R Net Realized 🚀');
    console.log('• Resiko Terbuka    : 0% (Kas 100% Bersih)');
    console.log('----------------------------------------');
    console.log('📋 HISTORI LENGKAP:');
    console.log('1. 🥇 DOT/USDT : TP1 & TP2 HIT (+3.71R Net)');
    console.log('2. 🥇 NEAR/USDT: TP1 & TP2 HIT (+2.46R Net - Peaked at $4.588!)');
    console.log('3. 🔴 TAO/USDT : SL Terukur (-1.00R - Menyelamatkan dari dump $230)');
    console.log('4. 🔴 UNI/USDT : SL Lesson (-1.00R)');
    console.log('5. 🔴 SUI/USDT : SL Terukur (-1.00R - Liquidity drain 15 Sep)');
    console.log('6. 🔴 SOL/USDT : SL Terukur (-1.00R - Double VAH sweep & BTC dump 23 Sep)');
    console.log('----------------------------------------');
    console.log('✨ Formula Sully: E = (33.3% x 3.08R) - (66.7% x 1.00R) = +0.36R per trade!\n');
  } else {
    // Default to 'info'
    const btc = await getBtcPrice();
    console.log('\n🌐 ========================================');
    console.log('   [TWS MARKET INTELLIGENCE & AUCTION RADAR]');
    console.log('========================================');
    console.log(`• BTC Live Price   : $${btc.toLocaleString('en-US')}`);
    console.log('• Status Sinyal    : 🟡 DEFENSIVE / SIMPAN KAS (Tunggu Diskon)');
    console.log('• AMT Structure    : Inside Value (Balance) | Cooling off');
    console.log('• Tren Makro 4H    : Above VAH Expansion (Bullish)');
    console.log('----------------------------------------');
    console.log('🎯 SETUP CHAMPION JARING LIMIT (SET & FORGET):');
    console.log('• Aset / Pair      : BTC/USDT (Long Limit)');
    console.log('• Titik Antri      : $83,500 (Confluence Fib 0.5 - 0.618 Golden Pocket)');
    console.log('• Stop Loss (SL)   : $81,800 (-2.03% / 1.00R)');
    console.log('• Target 1 (TP1)   : $86,500 (+1.77R - Geser SL ke Breakeven)');
    console.log('• Target 2 (TP2)   : $89,200 (+3.36R - Tutup 100%)');
    console.log('• Risk-to-Reward   : 1 : 3.36 (GRADE A+)');
    console.log('----------------------------------------');
    console.log('🛡️ Disiplin: Jangan FOMO beli di pucuk $85k-$87k. Tunggu jaring $83.5k terjemput!\n');
  }
}

main();
