"use client";
import { useState } from "react";
import Link from "next/link";
import { GROWTH, growthRows, countryGrowthPoints, shiftQuarter } from "@/lib/fiscal/growth";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getGrowthCopy, growthNumber, growthQuarter, growthInsight } from "./growth-copy";
import IndicatorRanking from "./IndicatorRanking";
import GrowthTrend from "./GrowthTrend";
import styles from "./growth.module.css";
import fiscal from "./fiscal.module.css";

export default function GrowthExplorer({ snapshot, lang = "en" }) {
  const copy = getGrowthCopy(lang);
  const [years,setYears] = useState(5), [mode,setMode] = useState("percent"), [code,setCode] = useState("NL");
  const rows = growthRows(snapshot,years,mode);
  const start = shiftQuarter(snapshot.latestQuarter,-4*years);
  const selected = rows.find(row=>row.code===code);
  const points = countryGrowthPoints(snapshot,code).filter(p=>p.quarter>=start);
  const name = countryName(code,lang);
  const insight = growthInsight(selected,name,lang);
  const columns = [{key:"start",label:copy.debt,period:growthQuarter(start,lang)},{key:"end",label:copy.debt,period:growthQuarter(snapshot.latestQuarter,lang)},{key:"amount",label:copy.amount},{key:"percent",label:copy.percent},{key:"ratio",label:copy.ratio,period:`${copy.start} → ${copy.end}`},{key:"pp",label:copy.pp}];
  const rankingRows = rows.map(row=>({code:row.code,rank:row.rank,name:countryName(row.code,lang),href:fiscalPath(`/country/${row.code.toLowerCase()}`,lang),cells:{
    start:{text:growthNumber(row.debt.first,lang,"compact"),status:row.debt.firstStatus},end:{text:growthNumber(row.debt.last,lang,"compact"),status:row.debt.lastStatus},amount:{text:growthNumber(row.debt.change,lang,"eur",true),status:row.debt.status},percent:{text:growthNumber(row.debt.percent,lang,"percent",true),status:row.debt.status},ratio:{text:`${growthNumber(row.ratio.first,lang,"percent")}${row.ratio.firstStatus} → ${growthNumber(row.ratio.last,lang,"percent")}${row.ratio.lastStatus}`},pp:{text:growthNumber(row.ratio.change,lang,"pp",true),status:row.ratio.status},
  }}));
  return <>
    <section className={fiscal.section} aria-label={copy.ranking}>
      <div className={styles.controls}><fieldset><legend>{copy.horizon}</legend><div className={styles.buttons}>{GROWTH.horizons.map(n=><button type="button" key={n} aria-pressed={years===n} onClick={()=>setYears(n)}>{n===1 ? copy.oneYear : `${n} ${copy.years}`}</button>)}</div></fieldset><div><label htmlFor="growth-mode">{copy.sort}</label><select id="growth-mode" value={mode} onChange={e=>setMode(e.target.value)}>{Object.entries(copy.modes).map(([id,text])=><option key={id} value={id}>{text}</option>)}</select></div></div>
      <p className={styles.periodLabel} role="status">{growthQuarter(start,lang)} → {growthQuarter(snapshot.latestQuarter,lang)} · {copy.modes[mode]}</p>
      <div className={styles.rankingWrap}><IndicatorRanking id="growth-ranking" title={copy.ranking} caption={`${copy.modes[mode]} · ${growthQuarter(start,lang)} → ${growthQuarter(snapshot.latestQuarter,lang)}`} columns={columns} rows={rankingRows} copy={copy} locale={copy.locale} /></div><p className={fiscal.note}>{copy.missing}</p><p className={fiscal.note}>{copy.flags}</p>
    </section>
    <section className={fiscal.section} aria-labelledby="growth-trend-title"><div className={fiscal.sectionHeading}><h2 id="growth-trend-title">{copy.trend}</h2><div className={styles.controls}><div><label htmlFor="growth-country">{copy.select}</label><select id="growth-country" value={code} onChange={e=>setCode(e.target.value)}>{[...rows].sort((a,b)=>countryName(a.code,lang).localeCompare(countryName(b.code,lang),copy.locale)).map(row=><option key={row.code} value={row.code}>{countryName(row.code,lang)}</option>)}</select></div></div></div>
      <div aria-live="polite"><p className={styles.periodLabel}>{name} · {growthQuarter(start,lang)} → {growthQuarter(snapshot.latestQuarter,lang)}</p>{insight && <p className={fiscal.insight}>{insight}</p>}{selected.divergence && <p className={fiscal.insight}>{copy.divergence}</p>}</div>
      <GrowthTrend points={points} name={name} lang={lang} /><Link className={fiscal.textLink} href={fiscalPath(`/country/${code.toLowerCase()}`,lang)}>{copy.countryLink} →</Link>
    </section>
  </>;
}
