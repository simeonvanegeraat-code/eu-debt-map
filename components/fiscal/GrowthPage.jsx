import FiscalRelatedLinks from "./FiscalRelatedLinks";
import { fiscalPageModified } from "@/lib/fiscal/discovery";
import Link from "next/link";
import snapshot from "@/lib/fiscal/growth.gen.json";
import { GROWTH, quarterEnd } from "@/lib/fiscal/growth";
import { fiscalPath } from "@/lib/fiscal/paths";
import typography from "@/components/typography/typography.module.css";
import { getGrowthCopy, growthQuarter } from "./growth-copy";
import GrowthExplorer from "./GrowthExplorer";
import GrowthSource from "./GrowthSource";
import styles from "./fiscal.module.css";
import { DERIVED_DATASET_LICENSE_URL } from "@/lib/dataset-license";
const SITE = "https://www.eudebtmap.com";
export function growthMetadata(lang = "en") {
  const copy = getGrowthCopy(lang), url = `${SITE}${fiscalPath("/debt-growth",lang)}`;
  const title = `${copy.title} (${growthQuarter(snapshot.latestQuarter,lang)}) | EU Debt Map`;
  return { title, description:copy.description, alternates:{canonical:url,languages:{...Object.fromEntries(["en","nl","de","fr"].map(l=>[l,`${SITE}${fiscalPath("/debt-growth",l)}`])),"x-default":`${SITE}/debt-growth`}},openGraph:{title,description:copy.description,url,type:"website",locale:copy.locale.replace("-","_"),images:[{url:`${SITE}/og/eu-debt-map.jpg`,width:1200,height:630,alt:"EU Debt Map"}]},twitter:{card:"summary_large_image",title,description:copy.description} };
}
export default function GrowthPage({ lang = "en" }) {
  const copy = getGrowthCopy(lang), url = `${SITE}${fiscalPath("/debt-growth",lang)}`;
  const modified = new Date(Math.max(Date.parse(snapshot.fetchedAt),Date.parse(GROWTH.reviewedAt))).toISOString();
  const graph = {"@context":"https://schema.org","@graph":[
    {"@type":"WebPage","@id":url,url,name:copy.title,description:copy.description,inLanguage:lang,dateModified:fiscalPageModified(modified),mainEntity:{"@id":`${url}#dataset`}},
    {"@type":"Dataset","@id":`${url}#dataset`,url:`${url}#debt-growth-methodology`,name:`${copy.shortTitle} · EU27`,description:copy.formula,creator:{"@type":"Organization",name:"EU Debt Map",url:SITE},publisher:{"@type":"Organization",name:"EU Debt Map",url:SITE},license:DERIVED_DATASET_LICENSE_URL,isBasedOn:GROWTH.metadata,dateModified:modified,temporalCoverage:`${quarterEnd(snapshot.periods[0])}/${quarterEnd(snapshot.latestQuarter)}`,spatialCoverage:"EU-27 (2020 composition)",variableMeasured:[{ "@type":"PropertyValue",name:copy.amount,unitText:"EUR"},{"@type":"PropertyValue",name:copy.percent,unitText:"percent"},{"@type":"PropertyValue",name:copy.pp,unitText:"percentage points"}]},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"EU Debt Map",item:`${SITE}${fiscalPath("/",lang)}`},{"@type":"ListItem",position:2,name:copy.shortTitle,item:url}]},
  ]};
  return <article className={`${styles.page} ${typography.page}`} lang={lang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,"\\u003c")}} />
    <header className={styles.hero}><div className={styles.shell}><p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p><p className={styles.period}>{copy.official}</p><dl className={styles.heroStats}><div><dt>{copy.latest}</dt><dd>{growthQuarter(snapshot.latestQuarter,lang)}</dd></div><div><dt>{copy.horizon}</dt><dd>1 · 5 · 10 <span>{copy.years}</span></dd></div><div><dt>{copy.countries}</dt><dd>27 <span>EU</span></dd></div></dl></div></header>
    <GrowthExplorer snapshot={{periods:snapshot.periods,latestQuarter:snapshot.latestQuarter,countries:snapshot.countries}} lang={lang} />
    <section className={`${styles.context} ${styles.shell}`} aria-labelledby="growth-context-title"><h2 id="growth-context-title">{copy.contextTitle}</h2><div className={styles.contextGrid}><div><h3>{copy.contextDebt}</h3><p>{copy.contextDebtText}</p><Link href={fiscalPath("/deficit",lang)}>{copy.balanceLink} →</Link></div><div><h3>{copy.contextRatio}</h3><p>{copy.contextRatioText}</p><Link href={fiscalPath("/",lang)}>{copy.debtLink} →</Link></div></div><p>{copy.fx}</p></section>
    <div className={styles.shell}><GrowthSource lang={lang} /></div>
    <FiscalRelatedLinks indicator="debt-growth" lang={lang} />
  </article>;
}
