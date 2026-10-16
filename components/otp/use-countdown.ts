"use client";

import { useEffect, useState } from "react";

// Segundos que faltan hasta `until` (timestamp en ms); se actualiza cada segundo.
export function useCountdown(until: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (now >= until) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [now, until]);

  return Math.max(0, (until - now) / 1000);
}
