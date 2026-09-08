import Link from "next/link";
import { articleFiscalIndicators } from "@/lib/fiscal/discovery";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getDiscoveryCopy } from "./discovery-copy";
import styles from "./discovery.module.css";

export default function ArticleFiscalLinks({ slug, lang = "en" }) {
  const group = articleFiscalIndicators(slug, lang);
  if (!group) return null;
  const copy = getDiscoveryCopy(lang);
  return <aside className={styles.articleLinks} aria-labelledby="article-fiscal-links-title" data-article-fiscal-links>
    <h2 id="article-fiscal-links-title">{copy.articleTitle}</h2><p>{copy[group.note]}</p>
    <ul className={styles.links}>{group.indicators.map(key => <li key={key}>
      <Link href={fiscalPath(`/${key}`, lang)} prefetch={false}>{copy.routes[key][0]} →</Link><p>{copy.routes[key][1]}</p>
    </li>)}</ul>
  </aside>;
}
