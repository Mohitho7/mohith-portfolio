import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPageSession();

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
