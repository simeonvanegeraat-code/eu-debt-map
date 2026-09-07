import AccountsPage, { accountsMetadata } from "@/components/fiscal/AccountsPage";
export const dynamic = "error";
export const metadata = accountsMetadata("nl");
export default function Page() { return <AccountsPage lang="nl" />; }
