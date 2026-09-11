"use client";

import { useEffect, useRef } from "react";
import { useTradeStore } from "@/stores/useTradeStore";

export default function PriceAutoStreamer() {
  const { refreshPrices } = useTradeStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Initial fetch on mount
    refreshPrices();

    // 2. Poll every 8 seconds
    timerRef.current = setInterval(() => {
      refreshPrices();
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshPrices]);

  return null;
}
