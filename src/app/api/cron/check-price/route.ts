import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

async function sendTelegramMessage(text: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML"
      })
    });
    return await res.json();
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function GET() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd", {
      next: { revalidate: 0 }
    });
    const data = await res.json();
    const price = data.solana?.usd;

    if (!price) {
      return NextResponse.json({ success: false, error: "Unable to fetch SOL price" });
    }

    const ENTRY_PRICE = 117.50;
    const SL_PRICE = 114.50;
    const TP1_PRICE = 123.50;
    const TP2_PRICE = 130.00;

    let alertTriggered = false;
    let message = "";

    // 1. Check Entry Limit
    if (price <= ENTRY_PRICE && price > SL_PRICE) {
      message =
        "🔔 <b>[TWS CLOUD ALERT - SOL ORDER TERJEMPUT!]</b>\n\n" +
        "Pair: <b>SOL/USDT</b>\n" +
        "Harga Terkini: <b>$" + price.toFixed(2) + "</b>\n" +
        "Status: <b>Limit Buy di $117.50 RESMI TERISI!</b> 🚀\n\n" +
        "Posisi Long sekarang AKTIF. Target TP1 kita di <b>$123.50</b> (+2.00R).";
      await sendTelegramMessage(message);
      alertTriggered = true;
    } else if (price >= TP1_PRICE && price < TP2_PRICE) {
      message =
        "🎯 <b>[TWS CLOUD ALERT - SOL TP1 HIT!]</b>\n\n" +
        "Pair: <b>SOL/USDT</b>\n" +
        "Harga Terkini: <b>$" + price.toFixed(2) + "</b> (+2.00R / +5.10%)\n\n" +
        "⚠️ <b>AKSI WAJIB SEKARANG</b>:\n" +
        "1. Amankan 50% profit di bursa Anda!\n" +
        "2. <b>GESER STOP LOSS ke Breakeven ($117.50)</b> seketika.\n\n" +
        "Modal Anda kini 100% BEBAS RISIKO (Anti-Rugi)!";
      await sendTelegramMessage(message);
      alertTriggered = true;
    } else if (price >= TP2_PRICE) {
      message =
        "🏁 <b>[TWS CLOUD ALERT - SOL TP2 SMASHED!]</b>\n\n" +
        "Pair: <b>SOL/USDT</b>\n" +
        "Harga Terkini: <b>$" + price.toFixed(2) + "</b> (+4.17R / +10.63%)\n\n" +
        "🎉 <b>TUTUP 100% SISA POSISI!</b>\n" +
        "Trade #005 selesai dengan kemenangan penuh telak (+4.17R)!";
      await sendTelegramMessage(message);
      alertTriggered = true;
    } else if (price <= SL_PRICE) {
      message =
        "🛑 <b>[TWS CLOUD ALERT - STOP LOSS SOL HIT]</b>\n\n" +
        "Pair: <b>SOL/USDT</b>\n" +
        "Harga Terkini: <b>$" + price.toFixed(2) + "</b>\n" +
        "Posisi ditutup terukur di -1.00R. Modal terlindungi dari kejatuhan lelang lebih dalam.";
      await sendTelegramMessage(message);
      alertTriggered = true;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      price,
      distanceToEntry: (price - ENTRY_PRICE).toFixed(2),
      alertTriggered
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
