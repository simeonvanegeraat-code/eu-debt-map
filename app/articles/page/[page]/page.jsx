import PaginatedArticleArchivePage, {
  getArticleArchiveMetadata,
  getArticleArchiveStaticParams,
} from "@/components/PaginatedArticleArchivePage";

export const runtime = "nodejs";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleArchiveStaticParams("en");
}

export function generateMetadata({ params }) {
  return getArticleArchiveMetadata({ lang: "en", page: params.page });
}

export default function ArticleArchivePage({ params }) {
  return <PaginatedArticleArchivePage lang="en" page={params.page} />;
}
