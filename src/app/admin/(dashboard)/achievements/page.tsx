import { connectDB } from "@/lib/mongodb";
import { Achievement } from "@/lib/models";
import AchievementsClient from "./AchievementsClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Achievements | Admin" };

export default async function AdminAchievementsPage() {
  await requireAdminPageSession();
  await connectDB();
  const achievementDocs = await Achievement.find().sort({ order: 1 }).lean();
  const initialAchievements = JSON.parse(JSON.stringify(achievementDocs));

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Achievements</h1>
      <p className={styles.welcomeText}>Add, edit, or pin your major milestones and participations. Pinned achievements appear on the homepage.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <AchievementsClient initialAchievements={initialAchievements} />
      </div>
    </div>
  );
}
