// app/api/gdp/route.js
import { NextResponse } from "next/server";
import * as Eurostat from "@/lib/eurostat.live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = (searchParams.get("geo") || "NL").toUpperCase();

    const getLatest =
      Eurostat.getLatestGDPForGeoEUR ||
      (Eurostat.default && Eurostat.default.getLatestGDPForGeoEUR);

    if (typeof getLatest !== "function") {
      const keys = [
        ...Object.keys(Eurostat || {}),
        ...Object.keys((Eurostat && Eurostat.default) || {}),
      ];
      throw new Error("getLatestGDPForGeoEUR not exported; exports: " + JSON.stringify(keys));
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
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
