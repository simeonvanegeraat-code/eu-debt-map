import PaginatedArticleArchivePage, {
  getArticleArchiveMetadata,
  getArticleArchiveStaticParams,
} from "@/components/PaginatedArticleArchivePage";

export const runtime = "nodejs";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleArchiveStaticParams("nl");
}

export async function generateMetadata({ params }) {
  const { page } = await params;
  return getArticleArchiveMetadata({ lang: "nl", page });
}

export default async function ArticleArchivePage({ params }) {
  const { page } = await params;
  return <PaginatedArticleArchivePage lang="nl" page={page} />;
}
