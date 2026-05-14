import type { NewsPost } from "@/lib/db/schema";

export default function NewsPreview({ post }: { post: NewsPost }) {
  const hasRuContent = post.ruTitle.trim() && post.ruBody.trim();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
          EN Preview
        </span>
        {post.enTitle ? (
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {post.enTitle}
          </h2>
        ) : (
          <p className="text-sm italic text-gray-300">No title</p>
        )}
        {post.enSummary && (
          <p className="text-sm text-gray-600 leading-relaxed">{post.enSummary}</p>
        )}
        {post.enBody ? (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap">
            {post.enBody}
          </p>
        ) : (
          <p className="text-xs italic text-gray-300">No body content yet</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
            RU Preview
          </span>
          {post.ruPublished ? (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              live
            </span>
          ) : (
            <span className="text-xs text-gray-400">not published</span>
          )}
        </div>
        {hasRuContent ? (
          <>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">
              {post.ruTitle}
            </h2>
            {post.ruSummary && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {post.ruSummary}
              </p>
            )}
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-6 whitespace-pre-wrap">
              {post.ruBody}
            </p>
          </>
        ) : (
          <p className="text-xs italic text-gray-300">No Russian content yet</p>
        )}
      </div>
    </div>
  );
}
