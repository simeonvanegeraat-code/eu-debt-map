import PaginatedArticleArchivePage, {
  getArticleArchiveMetadata,
  getArticleArchiveStaticParams,
} from "@/components/PaginatedArticleArchivePage";

export const runtime = "nodejs";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleArchiveStaticParams("fr");
}

export function generateMetadata({ params }) {
  return getArticleArchiveMetadata({ lang: "fr", page: params.page });
}

export default function ArticleArchivePage({ params }) {
  return <PaginatedArticleArchivePage lang="fr" page={params.page} />;
}
