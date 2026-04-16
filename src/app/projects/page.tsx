export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getSafeAssetUrl, getSafeExternalHref } from "@/lib/url-safety";

export const metadata = {
  title: "All Projects | Portfolio",
};

export default async function ProjectsArchivePage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      
      <div className="section-container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <h1 className="section-title" style={{ textAlign: "left", marginBottom: "16px" }}>Full <span>Project Archive</span></h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "48px", fontSize: "1.1rem" }}>A complete list of things I've built, experimented with, or contributed to.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px", marginBottom: "80px" }}>
          {projects.map((proj: any) => (
            <div key={proj.id} className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
              {getSafeAssetUrl(proj.imageUrl) && (
                <div style={{ width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", background: "rgba(0,0,0,0.5)", position: "relative" }}>
                  <Image 
                    src={getSafeAssetUrl(proj.imageUrl)!}
                    alt={proj.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover" }} 
                  />
                </div>
              )}
              <h3 style={{ fontSize: "1.4rem", marginBottom: "8px", color: "var(--foreground)" }}>{proj.title}</h3>
              <p style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px", fontWeight: "600" }}>{proj.techStack}</p>
              
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px", flex: 1 }}>{proj.description}</p>
              
              <div style={{ display: "flex", gap: "16px", marginTop: "auto" }}>
                {getSafeExternalHref(proj.demoLink) && <Link href={getSafeExternalHref(proj.demoLink)!} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, padding: "10px" }}>Live Demo</Link>}
                {getSafeExternalHref(proj.githubLink) && <Link href={getSafeExternalHref(proj.githubLink)!} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, padding: "10px" }}>GitHub</Link>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
