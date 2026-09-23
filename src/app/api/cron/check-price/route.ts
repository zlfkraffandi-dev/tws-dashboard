import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendTelegramMessage, fetchLatestChatId } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "tws_sentinel_2026_secure";

// Helper to convert any crypto pair format (e.g. "SOL/USDT", "BTC/USDT", "NEARUSDT.P") into Bybit Linear Ticker (e.g. "SOLUSDT")
function toBybitSymbol(symbol: string): string {
  const clean = symbol.replace(/[\/\s]/g, "").replace(/\.P$/i, "").toUpperCase();
  if (!clean.endsWith("USDT")) {
    return `${clean}USDT`;
  }
  return clean;
}

async function fetchBybitPrice(bybitSymbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${bybitSymbol}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const priceStr = data.result?.list?.[0]?.lastPrice;
    return priceStr ? parseFloat(priceStr) : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. TWEAK 2: Security & Authentication Check
    const authHeader = req.headers.get("authorization");
    const queryKey = req.nextUrl.searchParams.get("key");
    const isVercelCron = req.headers.get("x-vercel-cron");

    const isAuthorized =
      Boolean(isVercelCron) ||
      queryKey === CRON_SECRET ||
      (authHeader && authHeader.replace(/^Bearer\s+/i, "") === CRON_SECRET);

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Akses ditolak. Harap sertakan key pengaman (?key=CRON_SECRET atau Bearer Token).",
        },
        { status: 401 }
      );
    }

    const chatId = (await fetchLatestChatId()) || process.env.TELEGRAM_CHAT_ID || "";
    const updates: any[] = [];
    const priceCache: Record<string, number> = {};

    // 2. Fetch all active or pending trades from Supabase
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json({ success: false, error: "Database Supabase belum terkonfigurasi" });
    }

    const { data: activeTrades, error: dbError } = await supabase
      .from("trades")
      .select("*")
      .in("status", ["PENDING_LIMIT", "ACTIVE", "TP1_HIT"]);

    if (dbError) {
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    // 3. TWEAK 3: Universal Multi-Coin Automated Sentinel
    if (activeTrades && activeTrades.length > 0) {
      for (const trade of activeTrades) {
        const bybitSymbol = toBybitSymbol(trade.symbol);

        // Fetch price with cache reuse to optimize API calls
        if (!priceCache[bybitSymbol]) {
          const livePrice = await fetchBybitPrice(bybitSymbol);
          if (livePrice) {
            priceCache[bybitSymbol] = livePrice;
          }
        }

        const currentPrice = priceCache[bybitSymbol];
        if (!currentPrice) continue;

        const entry = Number(trade.entry_price);
        const sl = Number(trade.stop_loss);
        const tp1 = Number(trade.tp1);
        const tp2 = Number(trade.tp2);
        const isLong = (trade.side || "LONG").toUpperCase() === "LONG";

        // Evaluation Thresholds based on Direction
        const isSlHit = isLong ? currentPrice <= sl : currentPrice >= sl;
        const isTp2Hit = isLong ? currentPrice >= tp2 : currentPrice <= tp2;
        const isTp1Hit = isLong ? currentPrice >= tp1 : currentPrice <= tp1;
        const isLimitFilled =
          trade.status === "PENDING_LIMIT" &&
          (isLong
            ? currentPrice <= entry && currentPrice > sl
            : currentPrice >= entry && currentPrice < sl);

        // EVENT A: STOP LOSS HIT
        if (isSlHit && trade.status !== "STOP_LOSS") {
          await supabase
            .from("trades")
            .update({
              status: "STOP_LOSS",
              current_price: currentPrice,
              low_reached: Math.min(Number(trade.low_reached || currentPrice), currentPrice),
              realized_r: -1.0,
              floating_r: 0,
              total_r: -1.0,
              autopsy_summary: `Hit Stop Loss di $${sl} (Proteksi Modal saat Dump ke $${currentPrice})`,
              autopsy_what_happened: `Harga ${trade.symbol} terkoreksi menyentuh Stop Loss di $${sl}. Sistem otomatis memotong kerugian tepat di -1.00R.`,
              autopsy_key_lesson: `Disiplin cut loss -1R adalah polis asuransi mutlak: akun selamat dari kerugian lebih dalam.`,
              autopsy_safeguard_rule: `Trade ditutup 100% disiplin di $${sl} (-1.00R). Posisi kembali 100% kas bersih.`
            })
            .eq("id", trade.id);

          const alertMsg =
            `🛑 <b>[TWS CLOUD SENTINEL - STOP LOSS HIT]</b>\n\n` +
            `• Koin: <b>${trade.symbol}</b> (${trade.side})\n` +
            `• Harga Terkini: <b>$${currentPrice.toLocaleString("en-US")}</b>\n` +
            `• Level Stop Loss: <b>$${sl.toLocaleString("en-US")}</b>\n` +
            `• Hasil: <b>-1.00R Terkunci Disiplin</b>\n\n` +
            `🛡️ <i>SOP TWS: Kerugian dipotong seketika sebelum meluas. Posisi kembali 100% kas bersih di dashboard.</i>`;

          await sendTelegramMessage(alertMsg, chatId);
          updates.push({ id: trade.id, symbol: trade.symbol, event: "STOP_LOSS", price: currentPrice });
        }
        // EVENT B: TP2 / FINAL PROFIT HIT
        else if (isTp2Hit && trade.status !== "CLOSED_WIN") {
          const rDistance = Math.abs(entry - sl);
          const totalR = rDistance > 0 ? parseFloat((Math.abs(tp2 - entry) / rDistance).toFixed(2)) : 3.5;

          await supabase
            .from("trades")
            .update({
              status: "CLOSED_WIN",
              current_price: currentPrice,
              high_reached: Math.max(Number(trade.high_reached || currentPrice), currentPrice),
              realized_r: totalR,
              floating_r: 0,
              total_r: totalR,
              autopsy_summary: `Full Win TP2 Hit Sempurna di $${tp2} (+${totalR}R)`
            })
            .eq("id", trade.id);

          const alertMsg =
            `🏁 <b>[TWS CLOUD SENTINEL - TP2 SMASHED / FULL WIN]</b>\n\n` +
            `• Koin: <b>${trade.symbol}</b> (${trade.side})\n` +
            `• Harga Terkini: <b>$${currentPrice.toLocaleString("en-US")}</b>\n` +
            `• Target Profit 2: <b>$${tp2.toLocaleString("en-US")}</b>\n` +
            `• Hasil: <b>+${totalR}R Kemenangan Penuh!</b> 🚀\n\n` +
            `🎉 <i>SOP Kaku: Tutup 100% sisa posisi tanpa serakah. Evaluasi kemenangan resmi dicatat ke Arsip Buku Besar.</i>`;

          await sendTelegramMessage(alertMsg, chatId);
          updates.push({ id: trade.id, symbol: trade.symbol, event: "CLOSED_WIN", price: currentPrice });
        }
        // EVENT C: TP1 HIT (Amankan 50% & Geser SL ke Breakeven)
        else if (isTp1Hit && trade.status === "ACTIVE") {
          await supabase
            .from("trades")
            .update({
              status: "TP1_HIT",
              current_price: currentPrice,
              stop_loss: entry, // Otomatis lock ke BEP
              realized_r: 2.0
            })
            .eq("id", trade.id);

          const alertMsg =
            `🎯 <b>[TWS CLOUD SENTINEL - TP1 HIT!]</b>\n\n` +
            `• Koin: <b>${trade.symbol}</b>\n` +
            `• Harga: <b>$${currentPrice.toLocaleString("en-US")}</b> (+2.00R)\n\n` +
            `⚠️ <b>AKSI WAJIB DISIPLIN SEKARANG</b>:\n` +
            `1. Amankan 50% profit di bursa Anda!\n` +
            `2. <b>Stop Loss otomatis dikunci ke Breakeven ($${entry.toLocaleString("en-US")})</b>.\n\n` +
            `✨ <i>Posisi Anda kini 100% BEBAS RISIKO (Risk-Free)!</i>`;

          await sendTelegramMessage(alertMsg, chatId);
          updates.push({ id: trade.id, symbol: trade.symbol, event: "TP1_HIT", price: currentPrice });
        }
        // EVENT D: LIMIT ORDER TERISI
        else if (isLimitFilled) {
          await supabase
            .from("trades")
            .update({
              status: "ACTIVE",
              current_price: currentPrice
            })
            .eq("id", trade.id);

          const alertMsg =
            `🔔 <b>[TWS CLOUD SENTINEL - LIMIT ORDER TERISI!]</b>\n\n` +
            `• Koin: <b>${trade.symbol}</b> (${trade.side})\n` +
            `• Harga Terjemput: <b>$${currentPrice.toLocaleString("en-US")}</b>\n` +
            `• Status: <b>Order Limit di $${entry.toLocaleString("en-US")} RESMI AKTIF!</b> 🚀\n\n` +
            `🎯 Target TP1: <b>$${tp1.toLocaleString("en-US")}</b>\n` +
            `🛡️ Stop Loss: <b>$${sl.toLocaleString("en-US")}</b> (-1.00R)\n\n` +
            `<i>Posisi kini dalam pengawalan cloud sentinel 24/7.</i>`;

          await sendTelegramMessage(alertMsg, chatId);
          updates.push({ id: trade.id, symbol: trade.symbol, event: "ACTIVE", price: currentPrice });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      activeTradesCount: activeTrades ? activeTrades.length : 0,
      cachedPrices: priceCache,
      updatesProcessed: updates.length,
      updates
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
