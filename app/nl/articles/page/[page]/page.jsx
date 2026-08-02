import PaginatedArticleArchivePage, {
  getArticleArchiveMetadata,
  getArticleArchiveStaticParams,
} from "@/components/PaginatedArticleArchivePage";

export const runtime = "nodejs";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleArchiveStaticParams("nl");
}

export function generateMetadata({ params }) {
  return getArticleArchiveMetadata({ lang: "nl", page: params.page });
}

export default function ArticleArchivePage({ params }) {
  return <PaginatedArticleArchivePage lang="nl" page={params.page} />;
}
