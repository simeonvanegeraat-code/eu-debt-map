// app/api/gdp-all/route.js
import { NextResponse } from "next/server";
import { countries } from "@/lib/data";
import * as Eurostat from "@/lib/eurostat.live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

    const list = Array.isArray(countries) ? countries : [];
    const codes = list.map((c) => String(c.code).toUpperCase());

    // Parallel ophalen; Eurostat helper cachet resultaten per geo.
    const results = await Promise.all(
      codes.map(async (geo) => {
        try {
          const { valueEUR, period } = await getLatest(geo);
          return { geo, gdp_eur: Number.isFinite(valueEUR) ? valueEUR : null, period: period || null };
        } catch {
          return { geo, gdp_eur: null, period: null };
        }
      })
    );

    return NextResponse.json({ ok: true, items: results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
