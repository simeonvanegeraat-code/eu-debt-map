import GrowthPage, { growthMetadata } from "@/components/fiscal/GrowthPage";

export const dynamic = "error";
export const metadata = growthMetadata("de");

export default function DebtGrowthPage() { return <GrowthPage lang="de" />; }
