import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

async function sendTelegramMessage(chatId: string, text: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    return await res.json();
  } catch (err: any) {
    console.error("[Webhook Telegram Error]:", err.message);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();

    const msg = update.message || update.edited_message;
    if (!msg || !msg.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(msg.chat?.id || DEFAULT_CHAT_ID);
    const rawText = msg.text.trim().toLowerCase();

    // Fetch live SOL price from CoinGecko
    let liveSolPrice = 119.50;
    try {
      const pRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd", {
        next: { revalidate: 10 }
      });
      const pData = await pRes.json();
      if (pData.solana?.usd) liveSolPrice = pData.solana.usd;
    } catch {}

    if (rawText === "update" || rawText === "/update") {
      const distance = (liveSolPrice - 117.50).toFixed(2);
      const reply =
        "📡 <b>[LIVE PORTFOLIO STATUS - TWS QUANT (CLOUD 24/7)]</b>\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "• <b>Status Posisi</b>: ⏳ <b>1 ORDER LIMIT STANDBY</b>\n" +
        "• <b>Pair Aktif</b>: <b>SOL/USDT (Long Retest)</b>\n" +
        "• <b>Harga Running SOL</b>: <b>$" + liveSolPrice.toFixed(2) + "</b>\n" +
        "• <b>Jaring Limit Entry</b>: <code>$117.50</code> (Jarak: -$" + distance + ")\n" +
        "• <b>Stop Loss</b>: <code>$114.50</code> (-2.55% / -1.00R)\n" +
        "• <b>Target TP1</b>: <code>$123.50</code> (+2.00R ➔ Kunci BEP)\n" +
        "• <b>Target TP2</b>: <code>$130.00</code> (+4.17R)\n" +
        "• <b>Akumulasi Realized</b>: <b>+3.17R Net Profit</b> 🚀\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "☁️ <i>Serverless 24/7 Aktif: Bot ini merespons langsung dari Vercel Cloud tanpa butuh PC nyala!</i>";
      await sendTelegramMessage(chatId, reply);
    } else if (rawText === "info" || rawText === "/info") {
      const reply =
        "🌐 <b>[TWS MARKET & MACRO INTELLIGENCE]</b>\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "📰 <b>1. SCOUTING BERITA & MAKRO</b>:\n" +
        "• <b>Inflow ETF Rekor 2026</b>: Net inflow harian tembus <b>+$999 Juta USD</b> (BlackRock IBIT +$381M, Fidelity +$238M). Inilah pendorong reli $80k ➔ $87.3k.\n" +
        "• <b>Solana Ecosystem</b>: Volume DEX memimpin, pra-Breakpoint conference momentum memicu breakout ke level multi-week high.\n" +
        "• <b>Kalender Makro</b>: Bersih dari rilis inflasi Core PCE / GDP hingga 30 September.\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "📊 <b>2. STATUS LELANG AMT</b>:\n" +
        "• <b>SOL Live</b>: ~$" + liveSolPrice.toFixed(2) + " (Breakout Equal Highs $117.95 + BOS impulsif)\n" +
        "• <b>Order Block 1H</b>: $116.31 – $117.45 (Lantai penahan koreksi lelang)\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "🎯 <b>3. SETUP JARING LIMIT (GRADE A+)</b>:\n" +
        "• <b>Pair</b>: SOL/USDT (Long Limit)\n" +
        "• <b>Entry Jaring</b>: <code>$117.50</code>\n" +
        "• <b>Stop Loss</b>: <code>$114.50</code> (-2.55% / -1.00R)\n" +
        "• <b>TP1 / TP2</b>: <code>$123.50</code> (+2.00R) / <code>$130.00</code> (+4.17R)\n" +
        "• <b>Risk-to-Reward</b>: <b>1 : 4.17 (Grade A+)</b>\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "🛡️ <i>Disiplin: Dilarang FOMO di pucuk. Antri di lantai Order Block $117.50!</i>";
      await sendTelegramMessage(chatId, reply);
    } else if (rawText === "rekap" || rawText === "/rekap") {
      const reply =
        "📓 <b>[TWS MASTER SCOREBOARD & JURNAL]</b>\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "🏆 <b>TOTAL PERFORMA RESMI</b>:\n" +
        "• <b>Total Closed Trades</b>: 5 Trade (2 Win, 3 Loss)\n" +
        "• <b>Win Rate</b>: <b>40.0% Realized</b>\n" +
        "• <b>Akumulasi Net Profit</b>: <b>+3.17R Net Realized</b> 🚀\n" +
        "• <b>Order Berjalan</b>: <b>1 Setup #005 (SOL/USDT Limit @ $117.50)</b>\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "📋 <b>HISTORI LENGKAP</b>:\n" +
        "1. 🥇 <b>DOT/USDT</b>: TP1 & TP2 HIT (<b>+3.71R Net</b>)\n" +
        "2. 🥇 <b>NEAR/USDT</b>: TP1 & TP2 HIT (<b>+2.46R Net</b>)\n" +
        "3. 🔴 <b>TAO/USDT</b>: SL Terukur (<b>-1.00R</b>)\n" +
        "4. 🔴 <b>UNI/USDT</b>: SL Lesson (<b>-1.00R</b>)\n" +
        "5. 🔴 <b>SUI/USDT</b>: SL Terukur (<b>-1.00R</b>)\n" +
        "━━━━━━━━━━━━━━━━━━━━\n" +
        "✨ <i>Matematika Sully: (40% × +3.08R) - (60% × 1.00R) = +0.63R Expectancy Positif! Akun surplus terjaga.</i>";
      await sendTelegramMessage(chatId, reply);
    } else if (rawText === "start" || rawText === "/start" || rawText === "help" || rawText === "/help") {
      const reply =
        "🤖 <b>TWS 24/7 CLOUD BOT ASSISTANT</b>\n\n" +
        "Bot ini berjalan 24/7 di Vercel Cloud tanpa tergantung PC/komputer!\n\n" +
        "Perintah cepat yang bisa Anda ketik kapan saja:\n\n" +
        "• <b>update</b> ➔ Cek harga running & jarak jemputan limit SOL\n" +
        "• <b>info</b> ➔ Tinjauan 3 Pilar Makro, Berita & Lelang AMT\n" +
        "• <b>rekap</b> ➔ Lihat master scoreboard & histori (+3.17R)\n\n" +
        "<i>Coba ketik salah satu perintah di atas sekarang!</i>";
      await sendTelegramMessage(chatId, reply);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Webhook Handler Error]:", err.message);
    return NextResponse.json({ ok: true, error: err.message });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "TWS Telegram 24/7 Webhook Service",
    timestamp: new Date().toISOString()
  });
}
