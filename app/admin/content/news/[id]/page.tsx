import { getNewsPostById } from "@/lib/db/news-events-calendar-admin";
import NewsForm from "@/app/admin/content/_components/NewsForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params:       Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getNewsPostById(id);
  return { title: `Edit: ${post?.enTitle || id} — News Admin` };
}

export default async function EditNewsPage({ params, searchParams }: Props) {
  const { id }    = await params;
  const { saved } = await searchParams;

  const post = getNewsPostById(id);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/content/news"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← News
        </Link>
        <span className="text-xs text-gray-300">/</span>
        <span className="text-xs font-mono text-gray-500">{post.slug}</span>
      </div>
      <NewsForm
        key={saved ?? "init"}
        defaultValues={post}
        savedTs={saved}
      />
    </div>
  );
}
