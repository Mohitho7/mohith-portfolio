import TimelineClient from "./TimelineClient";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Timeline | Admin" };

export default async function AdminTimelinePage() {
  await requireAdminPageSession();
  const initialItems = await prisma.timelineItem.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Timeline</h1>
      <p className={styles.welcomeText}>Add your education, internships, and work experiences.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <TimelineClient initialItems={initialItems} />
      </div>
    </div>
  );
}
