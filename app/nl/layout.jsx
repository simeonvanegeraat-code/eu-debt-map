import DocumentLanguage from "@/components/DocumentLanguage";

export default function DutchLayout({ children }) {
  return (
    <>
      <DocumentLanguage lang="nl" />
      {children}
    </>
  );
}
