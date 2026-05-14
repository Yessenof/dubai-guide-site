import {
  getNewsPostById,
  newsRowToInput,
} from "@/lib/db/news-events-calendar-admin";
import { validateNewsPublish } from "@/lib/admin-validation/news-events-calendar";
import NewsForm from "@/app/admin/content/_components/NewsForm";
import NewsStatusPanel from "@/app/admin/content/_components/NewsStatusPanel";
import NewsPreview from "@/app/admin/content/_components/NewsPreview";
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

  const input = newsRowToInput(post);
  const today = new Date().toISOString().slice(0, 10);
  if (!input.date_published?.trim()) input.date_published = today;
  if (!input.date_updated?.trim())   input.date_updated   = today;
  const pubValidation = validateNewsPublish(input);

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

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <NewsForm
          key={saved ?? "init"}
          defaultValues={post}
          savedTs={saved}
        />
        <div className="space-y-4">
          <NewsStatusPanel
            postId={post.id}
            status={post.status}
            publishErrors={pubValidation.errors}
            publishWarnings={pubValidation.warnings}
          />
          <NewsPreview post={post} />
        </div>
      </div>
    </div>
  );
}
