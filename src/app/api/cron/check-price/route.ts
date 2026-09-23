import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendTelegramMessage, fetchLatestChatId } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const chatId = (await fetchLatestChatId()) || process.env.TELEGRAM_CHAT_ID || "";

    // 1. Fetch live real-time price directly from Bybit
    let solPrice = 0;
    try {
      const bybitRes = await fetch("https://api.bybit.com/v5/market/tickers?category=linear&symbol=SOLUSDT", {
        cache: "no-store",
      });
      const bybitData = await bybitRes.json();
      if (bybitData.result?.list?.[0]?.lastPrice) {
        solPrice = parseFloat(bybitData.result.list[0].lastPrice);
      }
    } catch {}

    if (!solPrice) {
      // Fallback to CoinGecko if Bybit is temporarily unreachable
      try {
        const cgRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd", {
          cache: "no-store",
        });
        const cgData = await cgRes.json();
        solPrice = cgData.solana?.usd || 0;
      } catch {}
    }

    if (!solPrice) {
      return NextResponse.json({ success: false, error: "Price source unavailable" });
    }

    let updates: any[] = [];

    // 2. Fetch active/pending trades from Supabase
    if (isSupabaseConfigured() && supabase) {
      const { data: activeTrades } = await supabase
        .from("trades")
        .select("*")
        .in("status", ["PENDING_LIMIT", "ACTIVE", "TP1_HIT"]);

      if (activeTrades && activeTrades.length > 0) {
        for (const trade of activeTrades) {
          const entry = Number(trade.entry_price);
          const sl = Number(trade.stop_loss);
          const tp1 = Number(trade.tp1);
          const tp2 = Number(trade.tp2);

          // Check for SOL/USDT specifically or matching symbol
          if (trade.symbol.includes("SOL")) {
            // STOP LOSS TRIGGER
            if (solPrice <= sl && trade.status !== "STOP_LOSS") {
              await supabase
                .from("trades")
                .update({
                  status: "STOP_LOSS",
                  current_price: solPrice,
                  low_reached: Math.min(Number(trade.low_reached || solPrice), solPrice),
                  realized_r: -1.0,
                  floating_r: 0,
                  total_r: -1.0,
                  autopsy_summary: `Hit Stop Loss di $${sl.toFixed(2)} (Proteksi Modal saat Dump ke $${solPrice.toFixed(2)})`,
                  autopsy_what_happened: `Harga terkoreksi menembus limit dan menyentuh Stop Loss di $${sl.toFixed(2)}. Sistem memotong kerugian tepat di -1.00R.`,
                  autopsy_key_lesson: `Disiplin SL -1R adalah polis asuransi mutlak memproteksi akun dari kerugian lebih dalam.`,
                  autopsy_safeguard_rule: `Trade ditutup 100% di $${sl.toFixed(2)} (-1.00R). Posisi kembali kas bersih.`
                })
                .eq("id", trade.id);

              const alertMsg =
                `🛑 <b>[TWS CLOUD SENTINEL - STOP LOSS HIT]</b>\n\n` +
                `• Koin: <b>${trade.symbol}</b>\n` +
                `• Harga Terkini: <b>$${solPrice.toFixed(2)}</b>\n` +
                `• Titik Stop Loss: <b>$${sl.toFixed(2)}</b>\n` +
                `• Hasil: <b>-1.00R Disiplin Terkunci</b>\n\n` +
                `🛡️ <i>SOP TWS: Kerugian dipotong seketika. Modal Anda terlindungi dari dump pasar yang lebih dalam. Posisi kembali 100% kas bersih.</i>`;

              await sendTelegramMessage(alertMsg, chatId);
              updates.push({ id: trade.id, event: "STOP_LOSS", price: solPrice });
            }
            // TP2 FINAL HIT
            else if (solPrice >= tp2 && trade.status !== "CLOSED_WIN") {
              const rDistance = Math.abs(entry - sl);
              const totalR = rDistance > 0 ? parseFloat(((tp2 - entry) / rDistance).toFixed(2)) : 4.17;

              await supabase
                .from("trades")
                .update({
                  status: "CLOSED_WIN",
                  current_price: solPrice,
                  high_reached: Math.max(Number(trade.high_reached || solPrice), solPrice),
                  realized_r: totalR,
                  floating_r: 0,
                  total_r: totalR,
                  autopsy_summary: `Full Win TP2 Hit Sempurna di $${tp2.toFixed(2)} (+${totalR}R)`,
                })
                .eq("id", trade.id);

              const alertMsg =
                `🏁 <b>[TWS CLOUD SENTINEL - TP2 SMASHED / FULL WIN]</b>\n\n` +
                `• Koin: <b>${trade.symbol}</b>\n` +
                `• Harga Terkini: <b>$${solPrice.toFixed(2)}</b>\n` +
                `• Target Profit 2: <b>$${tp2.toFixed(2)}</b>\n` +
                `• Hasil: <b>+${totalR}R Kemenangan Penuh!</b> 🚀\n\n` +
                `🎉 <i>Tutup 100% muatan tanpa serakah (anti round-tripping). Evaluasi kemenangan dicatat ke Buku Besar.</i>`;

              await sendTelegramMessage(alertMsg, chatId);
              updates.push({ id: trade.id, event: "TP2_HIT", price: solPrice });
            }
            // TP1 HIT
            else if (solPrice >= tp1 && trade.status === "ACTIVE") {
              await supabase
                .from("trades")
                .update({
                  status: "TP1_HIT",
                  current_price: solPrice,
                  stop_loss: entry, // Move to BEP
                  realized_r: 2.0,
                })
                .eq("id", trade.id);

              const alertMsg =
                `🎯 <b>[TWS CLOUD SENTINEL - TP1 HIT!]</b>\n\n` +
                `• Koin: <b>${trade.symbol}</b>\n` +
                `• Harga: <b>$${solPrice.toFixed(2)}</b> (+2.00R)\n\n` +
                `⚠️ <b>AKSI DISIPLIN SEKARANG</b>:\n` +
                `1. Amankan 50% profit di bursa Anda!\n` +
                `2. <b>Stop Loss otomatis digeser ke Breakeven ($${entry.toFixed(2)})</b>.\n` +
                `Posisi Anda resmi 100% BEBAS RISIKO (Risk-Free)!`;

              await sendTelegramMessage(alertMsg, chatId);
              updates.push({ id: trade.id, event: "TP1_HIT", price: solPrice });
            }
            // ENTRY FILLED
            else if (solPrice <= entry && trade.status === "PENDING_LIMIT" && solPrice > sl) {
              await supabase
                .from("trades")
                .update({
                  status: "ACTIVE",
                  current_price: solPrice,
                })
                .eq("id", trade.id);

              const alertMsg =
                `🔔 <b>[TWS CLOUD SENTINEL - LIMIT ORDER TERJEMPUT!]</b>\n\n` +
                `• Koin: <b>${trade.symbol}</b>\n` +
                `• Harga Terjemput: <b>$${solPrice.toFixed(2)}</b>\n` +
                `• Status: <b>Limit Buy di $${entry.toFixed(2)} RESMI TERISI!</b> 🚀\n\n` +
                `Posisi Long sekarang AKTIF dikawal 24/7 di awan.\n` +
                `🎯 Target TP1: <b>$${tp1.toFixed(2)}</b> (+2.00R)\n` +
                `🛡️ Stop Loss: <b>$${sl.toFixed(2)}</b> (-1.00R)`;

              await sendTelegramMessage(alertMsg, chatId);
              updates.push({ id: trade.id, event: "ENTRY_FILLED", price: solPrice });
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      solPrice,
      updatesProcessed: updates.length,
      updates,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
