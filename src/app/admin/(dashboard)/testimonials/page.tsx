import TestimonialsClient from "./TestimonialsClient";
import styles from "../admin.module.css";
import prisma from "@/lib/prisma";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Testimonials | Admin" };

export default async function AdminTestimonialsPage() {
  await requireAdminPageSession();
  const initialItems = await prisma.testimonial.findMany({
    orderBy: { order: "asc" }
  });

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
