import Link from "next/link";
import { countryName } from "@/lib/countries";
import { inflationCountryPath } from "@/lib/inflation/selection";
import { getInflationCopy } from "./copy";
import styles from "./inflation.module.css";

export default function CountryInflationLink({ code, lang }) {
  const copy = getInflationCopy(lang);
  return <aside className={styles.countryReferral}>
    <Link href={inflationCountryPath(code, lang)}>{copy.countryLink.replace("{country}", countryName(code, lang))} →</Link>
    <p>{copy.countryLinkNote}</p>
  </aside>;
}
