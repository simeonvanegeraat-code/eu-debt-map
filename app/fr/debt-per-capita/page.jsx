import PerCapitaPage, { perCapitaMetadata } from "@/components/fiscal/PerCapitaPage";

export const dynamic = "error";
export const metadata = perCapitaMetadata("fr");

export default function DebtPerCapitaPage() { return <PerCapitaPage lang="fr" />; }
