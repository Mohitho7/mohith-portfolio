import { connectDB } from "@/lib/mongodb";
import { About } from "@/lib/models";
import AboutForm from "./AboutForm";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage About | Admin" };

export default async function AdminAboutPage() {
  await requireAdminPageSession();
  await connectDB();
  const aboutDoc = await About.findOne().lean();
  const about = aboutDoc ? JSON.parse(JSON.stringify(aboutDoc)) : null;

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage About Section</h1>
      <p className={styles.welcomeText}>Update your personal story and background.</p>
      
      <div className="glass-card">
        <AboutForm initialData={about} />
      </div>
    </div>
  );
}
