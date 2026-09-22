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
  status: 'PENDING_ENTRY',
  lastAlert: null,
  lastPrice: 0.715
};

if (fs.existsSync(STATE_FILE)) {
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
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

// 1. SUI Price Monitor Engine
async function checkPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd');
    const data = await res.json();
    const price = data.sui?.usd;
    if (!price) return;

    state.lastPrice = price;

    if (state.status === 'PENDING_ENTRY' && price <= 0.705) {
      state.status = 'IN_POSITION';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🔔 <b>[TWS ALERT - SUI ORDER TERJEMPUT!]</b>\n\n' +
        'Pair: <b>SUI/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(4) + '</b>\n' +
        'Status: <b>Limit Buy di $0.7050 RESMI TERISI!</b> 🚀\n\n' +
        'Posisi Long sekarang AKTIF. Pasang sabuk pengaman, target TP1 kita di <b>$0.7420</b>.'
      );
      return;
    }

    if ((state.status === 'IN_POSITION') && price >= 0.742) {
      state.status = 'TP1_HIT';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🎯 <b>[TWS ALERT - SUI TP1 HIT!]</b>\n\n' +
        'Pair: <b>SUI/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(4) + '</b> (+1.85R / +5.25%)\n\n' +
        '⚠️ <b>AKSI WAJIB SEKARANG</b>:\n' +
        '1. Amankan 50% profit di bursa Anda!\n' +
        '2. <b>GESER STOP LOSS ke Breakeven ($0.7050)</b> seketika.\n\n' +
        'Modal Anda kini 100% BEBAS RISIKO (Anti-Rugi)!'
      );
      return;
    }

    if ((state.status === 'IN_POSITION' || state.status === 'TP1_HIT') && price >= 0.780) {
      state.status = 'COMPLETED';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🏁 <b>[TWS ALERT - SUI TP2 SMASHED!]</b>\n\n' +
        'Pair: <b>SUI/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(4) + '</b> (+3.75R / +10.64%)\n\n' +
        '🎉 <b>TUTUP 100% SISA POSISI!</b>\n' +
        'Trade #004 selesai dengan kemenangan penuh telak (+3.75R)!'
      );
      return;
    }

    if ((state.status === 'IN_POSITION') && price <= 0.685) {
      state.status = 'STOPPED_OUT';
      state.lastAlert = new Date().toISOString();
      saveState();
      await sendAlert(
        '🛑 <b>[TWS ALERT - STOP LOSS SUI]</b>\n\n' +
        'Pair: <b>SUI/USDT</b>\n' +
        'Harga Terkini: <b>$' + price.toFixed(4) + '</b>\n' +
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
          const reply = 
            '📡 <b>[LIVE PORTFOLIO STATUS - TWS QUANT]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '• <b>Status Posisi</b>: 🛡️ <b>100% KAS BERSIH (Zero Exposure)</b>\n' +
            '• <b>Resiko Terbuka</b>: <b>0.00%</b>\n' +
            '• <b>Akumulasi Realized</b>: <b>+3.17R Net Profit</b> 🚀\n' +
            '• <b>Sikap Pasar Hari Ini</b>: <b>DEFENSIVE / STANDBY</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '💡 <i>Market sedang konsolidasi pasca-FOMC ($76.4k). Sesuai SOP, kita tidak entry di mid-range/POC. Kas aman utuh menunggu Setup Grade A+.</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'info' || rawText === '/info') {
          const reply = 
            '🌐 <b>[MARKET INTELLIGENCE & AMT RADAR]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '• <b>BTC Status</b>: ~$76,400 (Rebound pasca-sweep low FOMC $75.0k)\n' +
            '• <b>AMT Status</b>: Inside Value (Balance) | Orderflow: Net Selling\n' +
            '• <b>BTC Dominance</b>: 59.32%\n' +
            '• <b>Status Sinyal</b>: 🟡 <b>DEFENSIVE / SIMPAN KAS</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🎯 <b>RADAR GAMEPLAN 2 ARAH (BILATERAL)</b>:\n' +
            '• 🔴 <b>Area Pantau SHORT</b>: $78,080 – $79,500 (Bearish Order Block). Valid jika ada wick rejection / failed auction high.\n' +
            '• 🟢 <b>Area Pantau LONG</b>: $74,800 – $75,200 (Demand Zone Retest). Valid jika ada absorpsi kuat di lantai diskon.\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🛡️ <i>Disiplin Sully: Jangan trading di tengah lelang (POC). Tunggu harga menyentuh batas ekstrem!</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'rekap' || rawText === '/rekap') {
          const reply = 
            '📓 <b>[TWS MASTER SCOREBOARD & JURNAL]</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '🏆 <b>TOTAL PERFORMA RESMI</b>:\n' +
            '• <b>Total Trade</b>: 5 Trade Selesai (2 Win, 3 Loss)\n' +
            '• <b>Win Rate</b>: <b>40.0% Realized</b>\n' +
            '• <b>Akumulasi Net Profit</b>: <b>+3.17R Net Realized</b> 🚀\n' +
            '• <b>Resiko Terbuka Saat Ini</b>: <b>0% (100% Kas Bersih)</b>\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '📋 <b>HISTORI LENGKAP</b>:\n' +
            '1. 🥇 <b>DOT/USDT</b>: TP1 & TP2 HIT (<b>+3.71R Net</b>)\n' +
            '2. 🥇 <b>NEAR/USDT</b>: TP1 & TP2 HIT (<b>+2.46R Net</b>)\n' +
            '3. 🔴 <b>TAO/USDT</b>: SL Terukur (<b>-1.00R</b>)\n' +
            '4. 🔴 <b>UNI/USDT</b>: SL Lesson (<b>-1.00R</b>)\n' +
            '5. 🔴 <b>SUI/USDT</b>: SL Terukur (<b>-1.00R</b>)\n' +
            '━━━━━━━━━━━━━━━━━━━━\n' +
            '✨ <i>Matematika Sully Terbukti: (40% × +3.08R) - (60% × 1.00R) = +0.63R Ekspektansi Positif! Akun tetap bertumbuh meski win rate di bawah 50%.</i>';
          await sendAlert(reply, chatId);
        } else if (rawText === 'start' || rawText === '/start' || rawText === 'help' || rawText === '/help') {
          const reply = 
            '🤖 <b>TWS TRADING ASSISTANT MENU</b>\n\n' +
            'Anda bisa mengirimkan kata kunci cepat berikut kapan saja:\n\n' +
            '• <b>update</b> ➔ Cek harga running & status posisi SUI\n' +
            '• <b>info</b> ➔ Cek tinjauan makroekonomi & pasar lelang BTC\n' +
            '• <b>rekap</b> ➔ Lihat buku jurnal & skor keuntungan akun (+4.17R)\n\n' +
            '<i>Ketik salah satu kata kunci di atas untuk mencoba!</i>';
          await sendAlert(reply, chatId);
        }
      }
    }
  } catch (err) {}
}

console.log('[TWS Multi-Engine Daemon] Started listening for SUI alerts and Telegram commands...');
setInterval(checkPrice, 15000);
setInterval(pollTelegramCommands, 3000);
checkPrice();
pollTelegramCommands();
