import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  getSafeAssetUrl,
  getSafeExternalHref,
  sanitizeTextContent,
} from "@/lib/url-safety";

export const metadata = {
  title: "All Projects | Portfolio",
};

export default async function ProjectsArchivePage() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1 }).lean();

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />

      <div
        className="section-container"
        style={{ paddingTop: "150px", minHeight: "80vh" }}
      >
        <h1
          className="section-title"
          style={{ textAlign: "left", marginBottom: "16px" }}
        >
          Full <span>Project Archive</span>
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "48px",
            fontSize: "1.1rem",
          }}
        >
          A complete list of things I've built, experimented with, or
          contributed to.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "32px",
            marginBottom: "80px",
          }}
        >
          {(projects as any[]).map((proj) => {
            const safeImageUrl = getSafeAssetUrl(proj.imageUrl);
            const safeTitle = sanitizeTextContent(
              proj.title || "Untitled Project",
            );
            const safeTechStack = sanitizeTextContent(proj.techStack || "");
            const safeDescription = sanitizeTextContent(proj.description || "");

            return (
              <div
                key={proj._id.toString()}
                className="glass-card"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {safeImageUrl && (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginBottom: "20px",
                      background: "rgba(0,0,0,0.5)",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={safeImageUrl}
                      alt={safeTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <h3
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: "8px",
                    color: "var(--foreground)",
                  }}
                >
                  {safeTitle}
                </h3>
                {safeTechStack && (
                  <p
                    style={{
                      color: "var(--accent)",
                      fontSize: "0.85rem",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {safeTechStack}
                  </p>
                )}

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    marginBottom: "24px",
                    flex: 1,
                  }}
                >
                  {safeDescription}
                </p>

                <div
                  style={{ display: "flex", gap: "16px", marginTop: "auto" }}
                >
                  {getSafeExternalHref(proj.demoLink) && (
                    <Link
                      href={getSafeExternalHref(proj.demoLink)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, padding: "10px" }}
                    >
                      Live Demo
                    </Link>
                  )}
                  {getSafeExternalHref(proj.githubLink) && (
                    <Link
                      href={getSafeExternalHref(proj.githubLink)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ flex: 1, padding: "10px" }}
                    >
                      GitHub
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
