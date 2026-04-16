import BlogsClient from "./BlogsClient";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Blogs | Admin" };

export default async function AdminBlogsPage() {
  await requireAdminPageSession();
  const initialBlogs = await prisma.blog.findMany({
    orderBy: { date: "desc" }
  });

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Blogs</h1>
      <p className={styles.welcomeText}>Write and manage your blog posts. Pinned blogs appear on the homepage.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <BlogsClient initialBlogs={initialBlogs} />
      </div>
    </div>
  );
}
