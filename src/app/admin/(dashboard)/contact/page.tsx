import ContactForm from "./ContactForm";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Contact | Admin" };

export default async function AdminContactPage() {
  await requireAdminPageSession();
  const contact = await prisma.contact.findFirst();

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Contact Info</h1>
      <p className={styles.welcomeText}>Update your social links and primary email address.</p>
      
      <div className="glass-card">
        <ContactForm initialData={contact} />
      </div>
    </div>
  );
}
