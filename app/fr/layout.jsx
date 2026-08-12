import DocumentLanguage from "@/components/DocumentLanguage";

export default function FrenchLayout({ children }) {
  return (
    <>
      <DocumentLanguage lang="fr" />
      {children}
    </>
  );
}
