import EUDebtPageExperience from "@/components/eu-debt-preview/EUDebtPageExperience";

export const metadata = {
  title: "EU-schuld — ontwerpvoorbeeld | EU Debt Map",
  description: "Lokale ontwerpstudie voor de Nederlandse EU-schuldpagina.",
  alternates: { canonical: null },
  robots: { index: false, follow: false, nocache: true },
};

export default function EUDebtPreview() {
  return <EUDebtPageExperience preview />;
}
