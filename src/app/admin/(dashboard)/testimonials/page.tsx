import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import TestimonialsClient from "./TestimonialsClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Testimonials | Admin" };

export default async function AdminTestimonialsPage() {
  await requireAdminPageSession();
  await connectDB();
  const itemDocs = await Testimonial.find().sort({ order: 1 }).lean();
  const initialItems = JSON.parse(JSON.stringify(itemDocs));

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Testimonials</h1>
      <p className={styles.welcomeText}>Add quotes and recommendations from people you've worked with.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <TestimonialsClient initialItems={initialItems} />
      </div>
    </div>
  );
}
