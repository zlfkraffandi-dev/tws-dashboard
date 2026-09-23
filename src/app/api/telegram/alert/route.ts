import { NextResponse } from "next/server";
import { sendTelegramMessage, fetchLatestChatId } from "@/lib/telegram";

export async function GET() {
  const chatId = await fetchLatestChatId() || process.env.TELEGRAM_CHAT_ID || "";

  const testMsg =
    "🚀 <b>TWS TRADING SYSTEM ALERT WEBHOOK TEST</b>\n\n" +
    "Webhook alert TradingView telah aktif dan tersambung sempurna ke Telegram bot Anda.\n\n" +
    "<i>Setiap alert lelang dari TradingView akan langsung diteruskan ke chat ini secara instan!</i>";
  const sent = await sendTelegramMessage(testMsg, chatId);

  return NextResponse.json({
    success: sent,
    chatId,
    message: sent ? "Pesan tes berhasil dikirim ke Telegram Anda!" : "Gagal mengirim pesan ke Telegram."
  });
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    const textContent = await req.text();
    
    // Support JSON or raw text body from TradingView
    try {
      body = JSON.parse(textContent);
    } catch {
      body = { message: textContent };
    }

    const { type, symbol, price, tp1, tp2, stopLoss, details, message } = body;
    const chatId = await fetchLatestChatId() || process.env.TELEGRAM_CHAT_ID || "";

    let msg = "";
    if (type === "ENTRY_FILLED") {
      msg =
        "🔔 <b>[TWS ALERT - ORDER LIMIT TERJEMPUT!]</b>\n\n" +
        "• Pair: <b>" + (symbol || "CRYPTO") + "</b>\n" +
        "• Harga Terjemput: <b>$" + (price || "") + "</b>\n" +
        "• Status: <b>Limit Order RESMI TERISI!</b> 🚀\n\n" +
        "Posisi Long sekarang AKTIF.\n" +
        (tp1 ? "🎯 Target TP1: <b>$" + tp1 + "</b>\n" : "") +
        (stopLoss ? "🛡️ Stop Loss: <b>$" + stopLoss + "</b> (-1.00R)\n" : "") +
        "\n<i>Siapkan sabuk pengaman dan disiplin ikuti trading plan!</i>";
    } else if (type === "TP1_HIT") {
      msg =
        "🎯 <b>[TWS ALERT - TP1 HIT!]</b>\n\n" +
        "• Pair: <b>" + (symbol || "CRYPTO") + "</b>\n" +
        "• Harga Saat Ini: <b>$" + (price || "") + "</b>\n\n" +
        "⚠️ <b>AKSI WAJIB DISIPLIN SEKARANG</b>:\n" +
        "1. Amankan 50% profit di bursa Anda!\n" +
        "2. <b>GESER STOP LOSS ke Breakeven ($" + (price || "Entry") + ")</b> seketika.\n\n" +
        "Modal Anda kini 100% BEBAS RISIKO (Anti-Rugi)!";
    } else if (type === "TP2_HIT" || type === "TP_FINAL") {
      msg =
        "🏁 <b>[TWS ALERT - TP2 SMASHED / FULL WINNER!]</b>\n\n" +
        "• Pair: <b>" + (symbol || "CRYPTO") + "</b>\n" +
        "• Harga Saat Ini: <b>$" + (price || "") + "</b>\n\n" +
        "🎉 <b>TUTUP 100% SISA POSISI!</b>\n" +
        "Trade selesai dengan kemenangan penuh! Dilarang serakah membiarkan profit berbalik (*anti round-tripping*).";
    } else if (type === "STOP_LOSS") {
      msg =
        "🛑 <b>[TWS ALERT - STOP LOSS TERUKUR]</b>\n\n" +
        "• Pair: <b>" + (symbol || "CRYPTO") + "</b>\n" +
        "• Harga: <b>$" + (price || "") + "</b>\n\n" +
        "Posisi ditutup terukur di -1.00R. Modal terlindungi secara sistemik dari kejatuhan harga lebih dalam.";
    } else {
      msg = "📢 <b>[TWS TRADINGVIEW ALERT]</b>\n\n" + (message || details || textContent || "Alert dari TradingView");
    }

    const sent = await sendTelegramMessage(msg, chatId);
    return NextResponse.json({ success: sent });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
