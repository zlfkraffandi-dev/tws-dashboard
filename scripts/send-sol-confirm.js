const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

const botToken = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

const text = '🎯 <b>[SETUP SOL/USDT RESMI MASUK REKAP & DAEMON]</b>\n' +
  '━━━━━━━━━━━━━━━━━━━━\n' +
  '• <b>Trade ID</b>: <b>TWS-005 (SOL/USDT Long)</b>\n' +
  '• <b>Status</b>: ⏳ <b>PENDING LIMIT ORDER</b>\n' +
  '• <b>Titik Antri (Entry)</b>: <code>$117.50</code>\n' +
  '• <b>Stop Loss</b>: <code>$114.50</code> (-2.55% / -1.00R)\n' +
  '• <b>Target 1 (TP1)</b>: <code>$123.50</code> (+2.00R / Lock BE)\n' +
  '• <b>Target 2 (TP2)</b>: <code>$130.00</code> (+4.17R)\n' +
  '• <b>Risk-to-Reward</b>: <b>1 : 4.17 (Grade A+)</b>\n' +
  '━━━━━━━━━━━━━━━━━━━━\n' +
  '🤖 <i>Bot @tradingjul_bot aktif mengawal harga 24/7. Notifikasi instan akan dikirim begitu $117.50 terjemput!</i>';

fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
})
  .then(res => res.json())
  .then(d => {
    console.log('Telegram Alert Sent:', d.ok);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
