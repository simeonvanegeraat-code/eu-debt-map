import PerCapitaPage, { perCapitaMetadata } from "@/components/fiscal/PerCapitaPage";

export const dynamic = "error";
export const metadata = perCapitaMetadata("en");

export default function DebtPerCapitaPage() { return <PerCapitaPage lang="en" />; }
