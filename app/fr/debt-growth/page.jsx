import GrowthPage, { growthMetadata } from "@/components/fiscal/GrowthPage";

export const dynamic = "error";
export const metadata = growthMetadata("fr");

export default function DebtGrowthPage() { return <GrowthPage lang="fr" />; }
