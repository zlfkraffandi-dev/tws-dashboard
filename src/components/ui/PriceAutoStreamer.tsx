"use client";

import { useEffect, useRef } from "react";
import { useTradeStore } from "@/stores/useTradeStore";

export default function PriceAutoStreamer() {
  const { refreshPrices, fetchTrades } = useTradeStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Initial sync of trades from database and live prices
    fetchTrades();
    refreshPrices();

    // 2. Poll prices & database state every 6 seconds
    timerRef.current = setInterval(() => {
      refreshPrices();
      fetchTrades();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshPrices, fetchTrades]);

  return null;
}
