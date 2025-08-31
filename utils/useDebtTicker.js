'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Live counter based on two points (t0, t1) and amounts (start, end).
 * All amounts are BigInt of euro cents.
 */
export function useDebtTicker({ startDebtCents, endDebtCents, t0, t1 }) {
  const t0s = Date.parse(t0) / 1000;
  const t1s = Date.parse(t1) / 1000;
  const duration = Math.max(1, t1s - t0s);
  const delta = Number(endDebtCents - startDebtCents);
  const rateCentsPerSec = delta / duration;

  const [nowCents, setNowCents] = useState(startDebtCents);
  const rafRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      const absoluteElapsed = Date.now() / 1000 - t0s;
      const cents = Number(startDebtCents) + rateCentsPerSec * absoluteElapsed;
      setNowCents(BigInt(Math.round(cents)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [startDebtCents, rateCentsPerSec, t0s]);

  return { nowCents, rising: endDebtCents > startDebtCents, rateCentsPerSec };
}
