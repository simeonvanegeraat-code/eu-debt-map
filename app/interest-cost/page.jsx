import InterestPage, { interestMetadata } from "@/components/fiscal/InterestPage";

export const dynamic = "error";
export const metadata = interestMetadata("en");

export default function InterestCostPage() { return <InterestPage lang="en" />; }
