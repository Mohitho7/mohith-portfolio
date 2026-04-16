import AchievementsClient from "./AchievementsClient";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Achievements | Admin" };

export default async function AdminAchievementsPage() {
  await requireAdminPageSession();
  const initialAchievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" }
  });

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
