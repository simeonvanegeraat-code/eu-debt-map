import typography from "@/components/typography/typography.module.css";
import FiscalMapPreview from "@/components/map-preview/FiscalMapPreview";
import balanceSnapshot from "@/lib/fiscal/balance.gen.json";
import interestSnapshot from "@/lib/fiscal/interest.gen.json";
import { balanceRows } from "@/lib/fiscal/balance-core";
import { interestRows } from "@/lib/fiscal/interest";

export const metadata = {
  title: "Fiscal map system preview | EU Debt Map",
  description: "Isolated preview of a unified fiscal map system.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function FiscalMapsPreviewPage() {
  const balance = balanceRows(balanceSnapshot).map((row) => ({
    code: row.code,
    value: row.balance,
    previous: row.previous,
    change: row.change,
    rank: row.rank,
    debtRatio: row.debtRatio,
  }));
  const interest = interestRows(interestSnapshot, "ratio").map((row) => ({
    code: row.code,
    value: row.ratio,
    amount: row.amount,
    perCapita: row.perCapita,
    revenueShare: row.revenueShare,
    rank: row.rank,
  }));

  return (
    <div className={typography.page}>
      <FiscalMapPreview
        balanceRows={balance}
        balanceYear={balanceSnapshot.latestCompleteYear}
        interestRows={interest}
        interestYear={interestSnapshot.latestYear}
      />
    </div>
  );
}
