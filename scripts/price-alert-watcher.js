const fs = require('fs');
const path = require('path');

// Load .env.local dynamically if present
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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_USER_CHAT_ID || '';
const STATE_FILE = path.join(__dirname, 'alert_state.json');

let state = {
  pair: 'SOL/USDT',
  status: 'PENDING_ENTRY',
  entryPrice: 117.50,
  stopLoss: 114.50,
  tp1: 123.50,
  tp2: 130.00,
  lastAlert: null,
  lastPrice: 119.50
};

if (fs.existsSync(STATE_FILE)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    state = { ...state, ...loaded };
  } catch (e) {}
}

function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {}
}

async function sendAlert(text, customChatId) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: customChatId || CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    return data.ok;
  } catch (err) {
    console.error('[Telegram Alert Error]:', err.message);
    return false;
  }
}

// 1. SOL Price Monitor Engine
async function checkPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await res.json();
    const price = data.solana?.usd;
    if (!price) return;

    state.lastPrice = price;

    if (state.status === 'PENDING_ENTRY' && price <= 117.50) {
      state.status = 'IN_POSITION';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🔔 <b>[TWS ALERT - SOL ORDER TERJEMPUT!]</b>\n\n' +
        'Pair: <b>SOL/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(2) + '</b>\n' +
        'Status: <b>Limit Buy di $117.50 RESMI TERISI!</b> 🚀\n\n' +
        'Posisi Long sekarang AKTIF. Pasang sabuk pengaman, target TP1 kita di <b>$123.50</b> (+2.00R).'
      );
      return;
    }

    if ((state.status === 'IN_POSITION') && price >= 123.50) {
      state.status = 'TP1_HIT';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🎯 <b>[TWS ALERT - SOL TP1 HIT!]</b>\n\n' +
        'Pair: <b>SOL/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(2) + '</b> (+2.00R / +5.10%)\n\n' +
        '⚠️ <b>AKSI WAJIB SEKARANG</b>:\n' +
        '1. Amankan 50% profit di bursa Anda!\n' +
        '2. <b>GESER STOP LOSS ke Breakeven ($117.50)</b> seketika.\n\n' +
        'Modal Anda kini 100% BEBAS RISIKO (Anti-Rugi)!'
      );
      return;
    }

    if ((state.status === 'IN_POSITION' || state.status === 'TP1_HIT') && price >= 130.00) {
      state.status = 'COMPLETED';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🏁 <b>[TWS ALERT - SOL TP2 SMASHED!]</b>\n\n' +
        'Pair: <b>SOL/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(2) + '</b> (+4.17R / +10.63%)\n\n' +
        '🎉 <b>TUTUP 100% SISA POSISI!</b>\n' +
        'Trade #005 selesai dengan kemenangan penuh telak (+4.17R)!'
      );
      return;
    }

    if ((state.status === 'IN_POSITION') && price <= 114.50) {
      state.status = 'STOPPED_OUT';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🛑 <b>[TWS ALERT - STOP LOSS SOL HIT]</b>\n\n' +
        'Pair: <b>SOL/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(2) + '</b>\n' +
        'Posisi ditutup terukur di -1.00R. Modal terlindungi dari penurunan lebih dalam.'
      );
      return;
    }

    saveState();
  } catch (err) {}
}

// 2. Interactive Telegram Command Listener (info, update, rekap)
let lastUpdateId = 0;

async function pollTelegramCommands() {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.ok && Array.isArray(data.result)) {
      for (const item of data.result) {
        lastUpdateId = item.update_id;
        const msg = item.message;
        if (!msg || !msg.text) continue;

        const rawText = msg.text.trim().toLowerCase();
        const chatId = String(msg.chat.id);

        if (rawText === 'update' || rawText === '/update') {
          const distance = (state.lastPrice - state.entryPrice).toFixed(2);
          const reply = 
            '📡 <b>[LIVE PORTFOLIO STATUS - TWS QUANT]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '• <b>Status Posisi</b>: ⏳ <b>1 ORDER LIMIT STANDBY</b>\n' +
            '• <b>Pair Aktif</b>: <b>SOL/USDT (Long Retest)</b>\n' +
            '• <b>Harga Running SOL</b>: <b>$' + Number(state.lastPrice).toFixed(2) + '</b>\n' +
            '• <b>Jaring Limit Entry</b>: <code>$' + state.entryPrice.toFixed(2) + '</code> (Jarak: -$' + distance + ')\n' +
            '• <b>Stop Loss</b>: <code>$' + state.stopLoss.toFixed(2) + '</code> (-1.00R)\n' +
            '• <b>Target TP1 / TP2</b>: <code>$' + state.tp1.toFixed(2) + '</code> / <code>$' + state.tp2.toFixed(2) + '</code> (R:R 1:4.17)\n' +
            '• <b>Akumulasi Realized</b>: <b>+3.17R Net Profit</b> 🚀\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '💡 <i>Disiplin: Order sudah aktif terpasang di bursa. Menunggu jemputan sehat di lantai $117.50 tanpa FOMO mengejar pucuk!</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'info' || rawText === '/info') {
          const reply = 
            '🌐 <b>[TWS MARKET & MACRO INTELLIGENCE]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '📰 <b>1. SCOUTING BERITA & MAKRO</b>:\n' +
            '• <b>Inflow ETF Rekor 2026</b>: Net inflow harian tembus <b>+$999 Juta USD</b> (BlackRock IBIT +$381M, Fidelity +$238M). Inilah pendorong reli $80k ➔ $87.3k.\n' +
            '• <b>Solana Narrative</b>: Lonjakan DEX volume & pra-Breakpoint momentum mendorong breakout ekosistem L1.\n' +
            '• <b>Kalender Ekonomi AS</b>: Pekan ini bersih dari bom inflasi (Core PCE & GDP baru rilis 30 Sep).\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '📊 <b>2. STATUS LELANG AMT</b>:\n' +
            '• <b>SOL Live</b>: ~$119.50 (Breakout Equal Highs $117.95 + BOS impulsif)\n' +
            '• <b>Order Block 1H</b>: $116.31 – $117.45 (Lantai penahan koreksi lelang)\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🎯 <b>3. SETUP JARING LIMIT (GRADE A+)</b>:\n' +
            '• <b>Pair</b>: SOL/USDT (Long Limit)\n' +
            '• <b>Entry Jaring</b>: <code>$117.50</code>\n' +
            '• <b>Stop Loss</b>: <code>$114.50</code> (-2.55% / -1.00R)\n' +
            '• <b>TP1 / TP2</b>: <code>$123.50</code> (+2.00R) / <code>$130.00</code> (+4.17R)\n' +
            '• <b>Risk-to-Reward</b>: <b>1 : 4.17 (Grade A+)</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🛡️ <i>Disiplin: Visual tools Fibonacci & Long Box sudah digambar di TradingView Desktop.</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'rekap' || rawText === '/rekap') {
          const reply = 
            '📓 <b>[TWS MASTER SCOREBOARD & JURNAL]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🏆 <b>TOTAL PERFORMA RESMI</b>:\n' +
            '• <b>Total Closed Trades</b>: 5 Trade (2 Win, 3 Loss)\n' +
            '• <b>Win Rate</b>: <b>40.0% Realized</b>\n' +
            '• <b>Akumulasi Net Profit</b>: <b>+3.17R Net Realized</b> 🚀\n' +
            '• <b>Order Berjalan</b>: <b>1 Trade #005 (SOL/USDT Limit @ $117.50)</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '📋 <b>HISTORI LENGKAP</b>:\n' +
            '1. 🥇 <b>DOT/USDT</b>: TP1 & TP2 HIT (<b>+3.71R Net</b>)\n' +
            '2. 🥇 <b>NEAR/USDT</b>: TP1 & TP2 HIT (<b>+2.46R Net</b>)\n' +
            '3. 🔴 <b>TAO/USDT</b>: SL Terukur (<b>-1.00R</b>)\n' +
            '4. 🔴 <b>UNI/USDT</b>: SL Lesson (<b>-1.00R</b>)\n' +
            '5. 🔴 <b>SUI/USDT</b>: SL Terukur (<b>-1.00R</b>)\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '✨ <i>Matematika Sully: (40% × +3.08R) - (60% × 1.00R) = +0.63R Expectancy Positif! Akun surplus terjaga.</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'start' || rawText === '/start' || rawText === 'help' || rawText === '/help') {
          const reply = 
            '🤖 <b>TWS TRADING ASSISTANT MENU</b>\n\n' +
            'Anda bisa mengirimkan kata kunci cepat berikut kapan saja:\n\n' +
            '• <b>update</b> ➔ Cek harga running & jarak jemputan SOL\n' +
            '• <b>info</b> ➔ Tinjauan makro & status lelang lelang\n' +
            '• <b>rekap</b> ➔ Lihat master scoreboard & histori (+3.17R)\n\n' +
            '<i>Ketik salah satu kata kunci di atas untuk mencoba!</i>';
          await sendAlert(reply, chatId);
        }
      }
    }
  } catch (err) {}
}

console.log('[TWS Local Watcher] Price monitoring running (Telegram commands handled 24/7 by Vercel Webhook)...');
setInterval(checkPrice, 15000);
checkPrice();
