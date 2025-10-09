// app/api/gdp/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";         // Edge vermijden
export const dynamic = "force-dynamic";  // niet cachen tijdens debug

async function loadEurostatModule() {
  // Probeer met expliciete extensie (Vercel/Next kan streng resolven)
  try {
    return await import("@/lib/eurostat.gen.js");
  } catch {}
  try {
    return await import("@/lib/eurostat.gen");
  } catch {}
  // Als alles faalt, gooi een duidelijke fout
  throw new Error("Cannot import '@/lib/eurostat.gen(.js)'");
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = (searchParams.get("geo") || "NL").toUpperCase();

    const mod = await loadEurostatModule();
    const getLatest =
      mod.getLatestGDPForGeoEUR ||
      (mod.default && mod.default.getLatestGDPForGeoEUR);

    if (typeof getLatest !== "function") {
      // Help debuggen: toon keys die wél geëxporteerd zijn
      const keys = [
        ...Object.keys(mod || {}),
        ...Object.keys((mod && mod.default) || {}),
      ];
      throw new Error(
        "getLatestGDPForGeoEUR not available from eurostat.gen; exports: " +
          JSON.stringify(keys)
      );
    }

    const t0 = Date.now();
    const { valueEUR, period, cached } = await getLatest(geo);
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
