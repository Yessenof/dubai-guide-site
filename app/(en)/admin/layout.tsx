import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminLogout from "@/components/admin/AdminLogout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin nav bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            Guidex Consulting{" "}
            <span className="font-normal text-gray-400">/ Admin</span>
          </span>
          {session && <AdminLogout />}
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
