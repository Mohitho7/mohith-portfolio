import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import ProjectsClient from "./ProjectsClient";
import styles from "../admin.module.css";
import { requireAdminPageSession } from "@/lib/admin-session";

export const metadata = { title: "Manage Projects | Admin" };

export default async function AdminProjectsPage() {
  await requireAdminPageSession();
  await connectDB();
  const projectDocs = await Project.find().sort({ order: 1 }).lean();
  const initialProjects = JSON.parse(JSON.stringify(projectDocs));

  return (
    <div className={styles.dashboardOverview}>
      <h1 className={styles.pageTitle}>Manage Projects</h1>
      <p className={styles.welcomeText}>Add, edit, or pin projects. Pinned projects appear on the homepage.</p>
      
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <ProjectsClient initialProjects={initialProjects} />
      </div>
    </div>
  );
}
