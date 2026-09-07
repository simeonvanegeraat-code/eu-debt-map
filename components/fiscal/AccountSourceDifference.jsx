import Link from "next/link";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getAccountsCopy, accountNumber } from "./accounts-copy";
import styles from "./accounts.module.css";

export default function AccountSourceDifference({ comparison, lang = "en" }) {
  if (!Number.isFinite(comparison?.difference) || comparison.difference === 0) return null;
  const copy = getAccountsCopy(lang);
  const value = (number, status) => `${accountNumber(number, lang, "percent", true)}${status ? ` (${status})` : ""}`;
  return <p className={styles.difference}>{comparison.year} · {copy.mismatch(value(comparison.accounts, comparison.accountsStatus), value(comparison.edp, comparison.edpStatus))} <Link href={fiscalPath("/government-spending#accounts-source-comparison", lang)}>{copy.revisionLink} →</Link></p>;
}
