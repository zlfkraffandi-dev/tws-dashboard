import { NextResponse } from "next/server";
import { sendTelegramMessage, fetchLatestChatId } from "@/lib/telegram";

export async function GET() {
  const chatId = await fetchLatestChatId();
  if (!chatId) {
    return NextResponse.json({
      success: false,
      message: "Belum ada chat_id terdeteksi. Silakan buka Telegram, cari @tradingjul_bot, lalu klik Start atau kirim pesan apapun ke bot tersebut.",
      bot: "@tradingjul_bot"
    });
  }

  const testMsg = "🚀 <b>TWS TRADING SYSTEM CONNECTED!</b>\n\nHalo! Bot notifikasi resmi Anda <b>@tradingjul_bot</b> telah tersambung sempurna ke sistem analisis TWS.\n\n📡 <b>Setup Aktif</b>: SUI/USDT (Long)\n🎯 <b>Entry Limit</b>: $0.705\n🛡️ <b>Stop Loss</b>: $0.685\n🏁 <b>TP1 / TP2</b>: $0.742 / $0.780\n\n<i>Bot ini akan otomatis memberi tahu Anda saat order terjemput atau target tercapai!</i>";
  const sent = await sendTelegramMessage(testMsg, chatId);

  return NextResponse.json({
    success: sent,
    chatId,
    message: sent ? "Pesan tes berhasil dikirim ke Telegram Anda!" : "Gagal mengirim pesan ke Telegram."
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, symbol, price, details } = body;
    const chatId = await fetchLatestChatId();

    if (!chatId) {
      return NextResponse.json({ success: false, error: "No chat_id" }, { status: 400 });
    }

    let msg = "";
    if (type === "ENTRY_FILLED") {
      msg = "🔔 <b>[TWS ALERT - ORDER TERJEMPUT]</b>\n\nPair: <b>" + symbol + "</b>\nStatus: <b>Limit Order FILLED di $" + price + "</b>\nPosisi Long resmi AKTIF! 🚀\nPasang sabuk pengaman, pantau TP1 di $0.742.";
    } else if (type === "TP1_HIT") {
      msg = "🎯 <b>[TWS ALERT - TP1 HIT!]</b>\n\nPair: <b>" + symbol + "</b>\nHarga: <b>$" + price + "</b>\n\n⚠️ <b>AKSI WAJIB</b>:\n1. Ambil 50% profit di bursa sekarang!\n2. <b>GESER STOP LOSS ke Breakeven ($0.705)</b> seketika.\n\nModal Anda kini 100% BEBAS RISIKO (Anti-Rugi)!";
    } else if (type === "TP2_HIT") {
      msg = "🏁 <b>[TWS ALERT - TP2 SMASHED / FULL WINNER!]</b>\n\nPair: <b>" + symbol + "</b>\nHarga: <b>$" + price + "</b>\n\n🎉 Tutup 100% sisa posisi. Trade selesai dengan kemenangan penuh (+3.75R)!";
    } else if (type === "STOP_LOSS") {
      msg = "🛑 <b>[TWS ALERT - STOP LOSS DISIPLIN]</b>\n\nPair: <b>" + symbol + "</b>\nHarga: <b>$" + price + "</b>\nPosisi ditutup terukur (-1.00R). Modal terlindungi secara sistemik.";
    } else {
      msg = "📢 <b>[TWS NOTIFICATION]</b>\n\n" + (details || "Update dari TWS Trading Engine");
    }

    const sent = await sendTelegramMessage(msg, chatId);
    return NextResponse.json({ success: sent });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
