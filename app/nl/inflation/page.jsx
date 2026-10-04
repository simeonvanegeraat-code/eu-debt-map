import InflationPage from "@/components/inflation/InflationPage";
import { inflationMetadata } from "@/lib/inflation/metadata";

export const dynamic = "error";
export const metadata = inflationMetadata("nl");

export default function Page() { return <InflationPage lang="nl" />; }
