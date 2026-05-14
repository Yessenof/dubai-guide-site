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

      <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
        <span className="font-semibold">Advanced Manual Editor.</span>{" "}
        Use{" "}
        <a href="/admin/content/ai-inbox" className="underline font-medium">AI Inbox</a>{" "}
        for new content. This form is for corrections, overrides, and final review only.
      </div>

      <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-xs">
        <span className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full ${
          post.status === "published" ? "text-emerald-700 bg-emerald-50"
            : post.status === "archived" ? "text-gray-400 bg-gray-100"
            : "text-gray-500 bg-gray-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            post.status === "published" ? "bg-emerald-500"
              : post.status === "archived" ? "bg-gray-300"
              : "bg-gray-400"
          }`} />
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
        {pubValidation.errors.length > 0 ? (
          <span className="text-gray-400">
            {pubValidation.errors.length} publish requirement{pubValidation.errors.length !== 1 ? "s" : ""} not met — see right panel
          </span>
        ) : (
          <span className="text-emerald-600 font-medium">Ready to publish</span>
        )}
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
