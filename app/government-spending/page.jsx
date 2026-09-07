import AccountsPage, { accountsMetadata } from "@/components/fiscal/AccountsPage";
export const dynamic = "error";
export const metadata = accountsMetadata("en");
export default function Page() { return <AccountsPage lang="en" />; }
