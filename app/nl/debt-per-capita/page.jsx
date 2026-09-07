import PerCapitaPage, { perCapitaMetadata } from "@/components/fiscal/PerCapitaPage";

export const dynamic = "error";
export const metadata = perCapitaMetadata("nl");

export default function DebtPerCapitaPage() { return <PerCapitaPage lang="nl" />; }
