import SkillsClient from "./SkillsClient";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Skills | Admin" };

export default async function AdminSkillsPage() {
  await requireAdminPageSession();
  const initialCategories = await prisma.skillCategory.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" }
  });

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Skills</h1>
      <p className={styles.welcomeText}>Group your technical proficiencies into distinct categories.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <SkillsClient initialCategories={initialCategories} />
      </div>
    </div>
  );
}
