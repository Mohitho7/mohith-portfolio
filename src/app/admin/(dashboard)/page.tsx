import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "./admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = {
  title: "Dashboard Overview | Admin",
};

export default async function AdminDashboardOverview() {
  const session = await requireAdminPageSession();
  const [projectCount, achievementCount, blogCount] = await Promise.all([
    prisma.project.count(),
    prisma.achievement.count(),
    prisma.blog.count(),
  ]);

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      <p className={styles.welcomeText}>Welcome back, {session.user?.name || "Admin"}. Use the sidebar to manage your portfolio content.</p>
      
      <div className={styles.statsGrid}>
        <div className={`glass-card ${styles.statCard}`}>
          <h3>Total Projects</h3>
          <div className={styles.statNumber}>{projectCount}</div>
          <Link href="/admin/projects" className="btn-secondary" style={{marginTop: "16px"}}>Manage Projects</Link>
        </div>
        
        <div className={`glass-card ${styles.statCard}`}>
          <h3>Achievements</h3>
          <div className={styles.statNumber}>{achievementCount}</div>
          <Link href="/admin/achievements" className="btn-secondary" style={{marginTop: "16px"}}>Manage Achievements</Link>
        </div>
        
        <div className={`glass-card ${styles.statCard}`}>
          <h3>Published Blogs</h3>
          <div className={styles.statNumber}>{blogCount}</div>
          <Link href="/admin/blogs" className="btn-secondary" style={{marginTop: "16px"}}>Manage Blogs</Link>
        </div>
      </div>
      
      <div className={`glass-card ${styles.quickActions}`} style={{marginTop: "40px"}}>
        <h3>Quick Actions</h3>
        <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
          <Link href="/admin/hero" className="btn-primary">Edit Hero Section</Link>
          <Link href="/admin/about" className="btn-secondary">Update About Me</Link>
          <Link href="/admin/contact" className="btn-secondary">Update Contact Details</Link>
        </div>
      </div>
    </div>
  );
}
