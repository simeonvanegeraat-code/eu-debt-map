import BalancePage, { balanceMetadata } from "@/components/fiscal/BalancePage";

export const dynamic = "error";
export const metadata = balanceMetadata("nl");

export default function DeficitPage() {
  return <BalancePage lang="nl" />;
}
