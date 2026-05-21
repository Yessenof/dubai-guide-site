import ContentAdminNav from "./_components/ContentAdminNav";

export default function ContentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Negative margins escape the root admin layout's px-6 py-8 padding,
    // filling the content area with the dark editorial background.
    <div className="-mx-6 -my-8 bg-[#0B0F19] min-h-[calc(100vh-3.5rem)] px-6 py-8">
      <div className="mb-6 border-b border-slate-700/50 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Guidex Content Admin
        </p>
      </div>
      <div className="flex gap-10">
        <ContentAdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
