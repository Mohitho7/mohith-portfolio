import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
import BlogsClient from "./BlogsClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Blogs | Admin" };

export default async function AdminBlogsPage() {
  await requireAdminPageSession();
  await connectDB();
  const blogDocs = await Blog.find().sort({ date: -1 }).lean();
  const initialBlogs = JSON.parse(JSON.stringify(blogDocs));

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
