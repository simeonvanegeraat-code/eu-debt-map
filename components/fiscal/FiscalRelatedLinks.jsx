import Link from "next/link";
import { listArticles } from "@/lib/articles";
import { RELATED_INDICATORS, relatedFiscalArticles } from "@/lib/fiscal/discovery";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getDiscoveryCopy } from "./discovery-copy";
import styles from "./discovery.module.css";

export default function FiscalRelatedLinks({ indicator, lang = "en" }) {
  const copy = getDiscoveryCopy(lang);
  const articles = relatedFiscalArticles(indicator, lang, listArticles({ lang }));
  return <section className={styles.section} aria-labelledby="fiscal-discovery-title" data-fiscal-discovery={indicator}>
    <h2 id="fiscal-discovery-title">{copy.title}</h2>
    <ul className={styles.links}>{RELATED_INDICATORS[indicator].map(key => <li key={key}>
      <Link href={fiscalPath(`/${key}`, lang)} prefetch={false}>{copy.routes[key][0]} →</Link><p>{copy.routes[key][1]}</p>
    </li>)}</ul>
    {articles.length > 0 && <div className={styles.analysis}><h3>{copy.articles}</h3>{articles.map(article => <div key={article.href}>
      <Link href={article.href} prefetch={false}>{article.title} →</Link><p>{copy[article.note]}</p>
    </div>)}</div>}
  </section>;
}
