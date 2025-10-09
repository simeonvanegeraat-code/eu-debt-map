// app/api/gdp-raw/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchJSON(url, { timeoutMs = 12000 } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      url,
      body: res.ok ? await res.json() : await res.text()
    });
  } catch (e) {
    return NextResponse.json({ ok:false, error:String(e), url }, { status: 500 });
  } finally {
    clearTimeout(id);
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const geo = (searchParams.get("geo") || "NL").toUpperCase();
  const qs = new URLSearchParams({
    na_item: "B1GQ",
    unit: "CP_MEUR",
    geo,
    format: "JSON",
    lang: "EN",
  });
  const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp?${qs.toString()}`;
  return fetchJSON(url);
}
