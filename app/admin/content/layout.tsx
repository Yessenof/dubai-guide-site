import ContentAdminNav from "./_components/ContentAdminNav";

export default function ContentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
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
