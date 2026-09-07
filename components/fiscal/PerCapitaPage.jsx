import Link from "next/link";
import snapshot from "@/lib/fiscal/per-capita.gen.json";
import { PER_CAPITA, perCapitaRows, perCapitaAggregate } from "@/lib/fiscal/per-capita";
import { fiscalPath } from "@/lib/fiscal/paths";
import { countryName } from "@/lib/countries";
import { editorialDisplay } from "@/lib/editorial-font";
import { getPerCapitaCopy, capitaNumber } from "./per-capita-copy";
import PerCapitaExplorer from "./PerCapitaExplorer";
import PerCapitaSource from "./PerCapitaSource";
import IndicatorRanking from "./IndicatorRanking";
import styles from "./fiscal.module.css";
import capitaStyles from "./per-capita.module.css";

const SITE = "https://www.eudebtmap.com";
export function perCapitaMetadata(lang = "en") {
  const copy = getPerCapitaCopy(lang);
  const title = `${copy.title} (${snapshot.debtYear}) | EU Debt Map`;
  const url = `${SITE}${fiscalPath("/debt-per-capita",lang)}`;
  return { title, description: copy.description,
    alternates: {canonical:url,languages:{...Object.fromEntries(["en","nl","de","fr"].map(l=>[l,`${SITE}${fiscalPath("/debt-per-capita",l)}`])),"x-default":`${SITE}/debt-per-capita`}},
    openGraph: {title,description:copy.description,url,type:"website",locale:copy.locale.replace("-","_"),images:[{url:`${SITE}/og/eu-debt-map.jpg`,width:1200,height:630,alt:"EU Debt Map"}]},
    twitter: {card:"summary_large_image",title,description:copy.description},
  };
}

export default function PerCapitaPage({ lang = "en" }) {
  const copy = getPerCapitaCopy(lang);
  const rows = perCapitaRows(snapshot);
  const eu = perCapitaAggregate(snapshot);
  const url = `${SITE}${fiscalPath("/debt-per-capita",lang)}`;
  const modified = new Date(Math.max(Date.parse(PER_CAPITA.reviewedAt),Date.parse(snapshot.fetchedAt))).toISOString();
  const graph = {"@context":"https://schema.org","@graph":[
    {"@type":"WebPage","@id":url,url,name:copy.title,description:copy.description,inLanguage:lang,dateModified:modified,mainEntity:{"@id":`${url}#dataset`}},
    {"@type":"Dataset","@id":`${url}#dataset`,url:`${url}#debt-per-capita-methodology`,name:`${copy.value} · EU-27 · ${snapshot.debtYear}`,description:`${copy.formula} ${copy.datesText}`,creator:{"@type":"Organization",name:"EU Debt Map",url:SITE},isBasedOn:[PER_CAPITA.debtMetadata,PER_CAPITA.populationMetadata],citation:copy.attribution,temporalCoverage:`${snapshot.debtDate}/${snapshot.populationDate}`,spatialCoverage:"EU-27 (2020 composition)",dateModified:modified,variableMeasured:{"@type":"PropertyValue",name:copy.value,unitText:"EUR per resident"},measurementTechnique:copy.formula},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"EU Debt Map",item:`${SITE}${fiscalPath("/",lang)}`},{"@type":"ListItem",position:2,name:copy.shortTitle,item:url}]},
  ]};
  const columns = [{key:"perCapita",label:copy.value,period:snapshot.debtYear},{key:"debt",label:copy.debt,period:snapshot.debtYear},{key:"ratio",label:copy.ratio,period:snapshot.debtYear},{key:"population",label:copy.population,period:snapshot.populationDate}];
  const rankingRows = rows.map(row=>({code:row.code,name:countryName(row.code,lang),rank:row.rank,href:fiscalPath(`/country/${row.code.toLowerCase()}`,lang),cells:{
    perCapita:{text:capitaNumber(row.displayValue,lang),status:row.status},debt:{text:capitaNumber(row.debtEur,lang),status:row.debtStatus},ratio:{text:capitaNumber(row.debtRatio,lang,"percent"),status:row.ratioStatus},population:{text:capitaNumber(row.population,lang,"number"),status:row.populationStatus},
  }}));
  return <article className={`${styles.page} ${editorialDisplay.variable}`} lang={lang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,"\\u003c")}} />
    <header className={styles.hero}><div className={styles.shell}><p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p><p className={styles.period}>{copy.calculated}</p>
      <dl className={styles.heroStats}><div><dt>{copy.eu}</dt><dd>{capitaNumber(eu?.value,lang)}</dd><small>{copy.perResident}</small></div><div><dt>{copy.debtDate}</dt><dd>{snapshot.debtYear}</dd><small>{snapshot.debtDate}</small></div><div><dt>{copy.populationDate}</dt><dd>{snapshot.populationYear}</dd><small>{snapshot.populationDate}</small></div></dl><p className={styles.heroNote}>{copy.euNote}</p>{eu?.status && <p className={styles.heroNote}>{copy.estimate}</p>}
    </div></header>
    <div className={styles.shell}><p className={capitaStyles.notice}>{copy.warning}</p></div>
    <PerCapitaExplorer rows={rows} debtYear={snapshot.debtYear} populationYear={snapshot.populationYear} lang={lang} />
    <IndicatorRanking id="per-capita-ranking" title={copy.rankingTitle} caption={`${copy.value} · ${snapshot.debtYear} / ${snapshot.populationDate}`} columns={columns} rows={rankingRows} copy={{search:copy.search,rankNote:copy.rankNote,shown:copy.shown,noResults:copy.noResults,rank:copy.rank,country:copy.country}} locale={copy.locale} />
    <section className={`${styles.context} ${styles.shell}`} aria-labelledby="per-capita-context-title"><p className={styles.eyebrow}>{copy.calculation}</p><h2 id="per-capita-context-title">{copy.contextTitle}</h2><div className={styles.contextGrid}><div><h3>{copy.datesTitle}</h3><p>{copy.datesText}</p><p>{copy.formula}</p></div><div><h3>{copy.meaningTitle}</h3><p>{copy.meaningText}</p><Link href={fiscalPath("/deficit",lang)}>{copy.balanceLink} →</Link></div></div><Link className={styles.textLink} href={fiscalPath("/",lang)}>{copy.debtLink} →</Link></section>
    <div className={styles.shell}><PerCapitaSource lang={lang} /></div>
  </article>;
}
