import InterestPage, { interestMetadata } from "@/components/fiscal/InterestPage";

export const dynamic = "error";
export const metadata = interestMetadata("de");

export default function InterestCostPage() { return <InterestPage lang="de" />; }
