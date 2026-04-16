import prisma from "@/lib/prisma";
import AboutForm from "./AboutForm";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage About | Admin" };

export default async function AdminAboutPage() {
  await requireAdminPageSession();
  const about = await prisma.about.findFirst();

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
