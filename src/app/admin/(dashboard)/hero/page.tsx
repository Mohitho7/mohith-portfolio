import { connectDB } from "@/lib/mongodb";
import { Hero } from "@/lib/models";
import HeroForm from "./HeroForm";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Hero | Admin" };

export default async function AdminHeroPage() {
  await requireAdminPageSession();
  await connectDB();
  const heroDoc = await Hero.findOne().lean();
  const hero = heroDoc ? JSON.parse(JSON.stringify(heroDoc)) : null;

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Hero Section</h1>
      <p className={styles.welcomeText}>Update the content that visitors see first when they land on your portfolio.</p>
      
      <div className="glass-card">
        <HeroForm initialData={hero} />
      </div>
    </div>
  );
}
