import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models";
import ContactForm from "./ContactForm";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Contact | Admin" };

export default async function AdminContactPage() {
  await requireAdminPageSession();
  await connectDB();
  const contactDoc = await Contact.findOne().lean();
  const contact = contactDoc ? JSON.parse(JSON.stringify(contactDoc)) : null;

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
