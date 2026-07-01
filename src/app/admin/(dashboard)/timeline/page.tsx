import { connectDB } from "@/lib/mongodb";
import { TimelineItem } from "@/lib/models";
import TimelineClient from "./TimelineClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Timeline | Admin" };

export default async function AdminTimelinePage() {
  await requireAdminPageSession();
  await connectDB();
  const itemDocs = await TimelineItem.find().sort({ order: 1 }).lean();
  const initialItems = JSON.parse(JSON.stringify(itemDocs));

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
