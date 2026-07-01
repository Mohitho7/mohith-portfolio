import { connectDB } from "@/lib/mongodb";
import { SkillCategory, Skill } from "@/lib/models";
import SkillsClient from "./SkillsClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Skills | Admin" };

export default async function AdminSkillsPage() {
  await requireAdminPageSession();
  await connectDB();
  const categories = await SkillCategory.find().sort({ order: 1 }).lean();
  const skills = await Skill.find().sort({ order: 1 }).lean();
  const initialCategories = JSON.parse(JSON.stringify(
    categories.map((cat: any) => ({
      ...cat,
      id: cat._id.toString(),
      skills: skills
        .filter((s: any) => s.categoryId?.toString() === cat._id.toString())
        .map((s: any) => ({ ...s, id: s._id.toString(), categoryId: s.categoryId?.toString() })),
    }))
  ));

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
