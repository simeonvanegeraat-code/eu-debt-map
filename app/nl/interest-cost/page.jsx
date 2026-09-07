import InterestPage, { interestMetadata } from "@/components/fiscal/InterestPage";

export const dynamic = "error";
export const metadata = interestMetadata("nl");

export default function InterestCostPage() { return <InterestPage lang="nl" />; }
