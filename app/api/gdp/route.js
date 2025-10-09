// app/api/gdp/route.js
import { NextResponse } from "next/server";
import { getLatestGDPForGeoEUR } from "@/lib/eurostat.gen";

export const runtime = "nodejs";         // voorkom Edge-runtime
export const dynamic = "force-dynamic";  // nooit cachen

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = (searchParams.get("geo") || "NL").toUpperCase();

    const t0 = Date.now();
    const { valueEUR, period, cached } = await getLatestGDPForGeoEUR(geo);
    const ms = Date.now() - t0;

    return NextResponse.json({
      ok: true,
      geo,
      gdp_eur: Number.isFinite(valueEUR) ? valueEUR : null,
      gdp_pretty: Number.isFinite(valueEUR)
        ? "€ " + new Intl.NumberFormat("en-GB").format(Math.round(valueEUR))
        : null,
      period: period || null,
      cached: !!cached,
      took_ms: ms,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
