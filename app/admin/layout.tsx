import AdminSidebar from "@/features/admin/AdminSidebar";
import AdminGuard from "@/features/admin/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-bg-main">
        <AdminSidebar />
        <div className="flex-1 ml-64 min-h-screen">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
