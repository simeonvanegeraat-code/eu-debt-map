import BalancePage, { balanceMetadata } from "@/components/fiscal/BalancePage";

export const dynamic = "error";
export const metadata = balanceMetadata("fr");

export default function DeficitPage() {
  return <BalancePage lang="fr" />;
}
