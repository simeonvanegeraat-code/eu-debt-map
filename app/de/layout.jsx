import DocumentLanguage from "@/components/DocumentLanguage";

export default function GermanLayout({ children }) {
  return (
    <>
      <DocumentLanguage lang="de" />
      {children}
    </>
  );
}
