import { NextResponse } from "next/server";
import { initialTrades, initialMacro, initialStats } from "@/data/initialTrades";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Trade, MacroOverview, PortfolioStats } from "@/types/trade";

export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { data: dbTrades, error: tradesError } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: dbMacro, error: macroError } = await supabase
        .from("macro_state")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!tradesError && dbTrades && dbTrades.length > 0) {
        const trades: Trade[] = dbTrades.map((row: any) => ({
          id: row.id,
          symbol: row.symbol,
          side: row.side,
          callDate: row.call_date,
          entryPrice: Number(row.entry_price),
          currentPrice: Number(row.current_price),
          stopLoss: Number(row.stop_loss),
          tp1: Number(row.tp1),
          tp2: Number(row.tp2),
          highReached: row.high_reached ? Number(row.high_reached) : undefined,
          lowReached: row.low_reached ? Number(row.low_reached) : undefined,
          status: row.status,
          riskPct: Number(row.risk_pct),
          realizedR: Number(row.realized_r || 0),
          floatingR: Number(row.floating_r || 0),
          totalR: Number(row.total_r || 0),
          amtSetupType: row.amt_setup_type,
          autopsy: row.autopsy_summary ? {
            summary: row.autopsy_summary,
            whatHappened: row.autopsy_what_happened || "",
            keyLesson: row.autopsy_key_lesson || "",
            safeguardRule: row.autopsy_safeguard_rule || ""
          } : undefined
        }));

        const macro: MacroOverview = dbMacro ? {
          regime: dbMacro.regime,
          btcPrice: Number(dbMacro.btc_price),
          btcChange24h: Number(dbMacro.btc_change_24h),
          totalMarketCap: dbMacro.total_market_cap,
          notes: dbMacro.notes,
          lastUpdated: dbMacro.last_updated
        } : initialMacro;

        const realizedRTotal = Number(trades.reduce((acc, t) => acc + (t.realizedR || 0), 0).toFixed(2));
        const floatingRTotal = Number(trades.reduce((acc, t) => acc + (t.floatingR || 0), 0).toFixed(2));
        const closedCount = trades.filter((t) => t.status === "CLOSED_WIN" || t.status === "STOP_LOSS").length;
        const winCount = trades.filter((t) => t.status === "CLOSED_WIN" || (t.status === "TP1_HIT" && t.realizedR > 0)).length;
        const winRatePct = closedCount > 0 ? Number(((winCount / trades.length) * 100).toFixed(1)) : 50;

        const stats: PortfolioStats = {
          totalTrades: trades.length,
          winRatePct,
          netRMultiple: realizedRTotal,
          maxDrawdownR: 1.00,
          activeTradesCount: trades.filter((t) => t.status === "ACTIVE" || t.status === "TP1_HIT").length,
          realizedRTotal,
          floatingRTotal
        };

        return NextResponse.json({
          success: true,
          source: "supabase",
          data: { macro, trades, stats, timestamp: new Date().toISOString() }
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "local_seed",
      data: {
        macro: initialMacro,
        trades: initialTrades,
        stats: initialStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      source: "fallback_error",
      error: error.message,
      data: {
        macro: initialMacro,
        trades: initialTrades,
        stats: initialStats,
        timestamp: new Date().toISOString()
      }
    });
  }
}

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      }, { status: 400 });
    }

    const body = await req.json();
    const { trade } = body;

    if (!trade || !trade.id || !trade.symbol) {
      return NextResponse.json({ success: false, error: "Invalid trade payload" }, { status: 400 });
    }

    const row = {
      id: trade.id,
      symbol: trade.symbol,
      side: trade.side,
      call_date: trade.callDate,
      entry_price: trade.entryPrice,
      current_price: trade.currentPrice,
      stop_loss: trade.stopLoss,
      tp1: trade.tp1,
      tp2: trade.tp2,
      high_reached: trade.highReached || null,
      low_reached: trade.lowReached || null,
      status: trade.status,
      risk_pct: trade.riskPct,
      realized_r: trade.realizedR || 0,
      floating_r: trade.floatingR || 0,
      total_r: trade.totalR || 0,
      amt_setup_type: trade.amtSetupType,
      autopsy_summary: trade.autopsy?.summary || null,
      autopsy_what_happened: trade.autopsy?.whatHappened || null,
      autopsy_key_lesson: trade.autopsy?.keyLesson || null,
      autopsy_safeguard_rule: trade.autopsy?.safeguardRule || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("trades")
      .upsert(row)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
