import InterestPage, { interestMetadata } from "@/components/fiscal/InterestPage";

export const dynamic = "error";
export const metadata = interestMetadata("fr");

export default function InterestCostPage() { return <InterestPage lang="fr" />; }
