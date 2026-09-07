import BalancePage, { balanceMetadata } from "@/components/fiscal/BalancePage";

export const dynamic = "error";
export const metadata = balanceMetadata("de");

export default function DeficitPage() {
  return <BalancePage lang="de" />;
}
