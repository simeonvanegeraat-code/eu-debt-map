import PerCapitaPage, { perCapitaMetadata } from "@/components/fiscal/PerCapitaPage";

export const dynamic = "error";
export const metadata = perCapitaMetadata("de");

export default function DebtPerCapitaPage() { return <PerCapitaPage lang="de" />; }
