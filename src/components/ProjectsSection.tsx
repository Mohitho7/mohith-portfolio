"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { getSafeAssetUrl, getSafeExternalHref } from "@/lib/url-safety";

function ProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
  const safeImageUrl = getSafeAssetUrl(project.imageUrl);
  const safeDemoLink = getSafeExternalHref(project.demoLink);
  const safeGithubLink = getSafeExternalHref(project.githubLink);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: "20px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
        >
          <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "var(--foreground)", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}>
            x
          </button>

          {safeImageUrl && (
            <div style={{ width: "100%", height: "240px", overflow: "hidden", borderRadius: "20px 20px 0 0", position: "relative" }}>
              <Image
                src={safeImageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 600px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          <div style={{ padding: "32px" }}>
            <p style={{ color: "var(--accent)", fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>{project.techStack}</p>
            <h3 style={{ fontSize: "1.7rem", fontFamily: "var(--font-serif)", color: "var(--foreground)", marginBottom: "16px", lineHeight: "1.2" }}>{project.title}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: "1.7", marginBottom: "12px" }}>{project.description}</p>

            {project.outcome && (
              <div style={{ padding: "12px 16px", background: "rgba(212,175,55,0.07)", borderLeft: "3px solid var(--accent)", borderRadius: "0 8px 8px 0", marginBottom: "28px" }}>
                <p style={{ color: "var(--foreground)", fontSize: "0.92rem", lineHeight: "1.6" }}>Outcome: {project.outcome}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {safeDemoLink && (
                <Link href={safeDemoLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: "1 1 140px", textAlign: "center", padding: "11px 20px" }}>
                  Live Demo -
                </Link>
              )}
              {safeGithubLink && (
                <Link href={safeGithubLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: "1 1 140px", textAlign: "center", padding: "11px 20px" }}>
                  GitHub -
                </Link>
              )}
              {!safeDemoLink && !safeGithubLink && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No links available.</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProjectsSection({ projects }: { projects: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Selected <span>Work</span></h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px", marginBottom: "40px" }}>
          {projects.map((proj, idx) => {
            const safeImageUrl = getSafeAssetUrl(proj.imageUrl);

            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setSelected(proj)}
                className="glass-card"
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}
              >
                {safeImageUrl && (
                  <div style={{ width: "100%", height: "190px", overflow: "hidden", position: "relative" }}>
                    <Image
                      src={safeImageUrl}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: "cover",
                        opacity: 0.75,
                        transition: "opacity 0.3s ease, transform 0.4s ease"
                      }}
                      className="project-image-hover"
                    />
                    <div
                      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0)", transition: "background 0.3s", opacity: 0 }}
                      className="project-overlay"
                    />
                  </div>
                )}
                <div style={{ padding: "20px 22px 24px" }}>
                  <p style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{proj.techStack}</p>
                  <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", color: "var(--foreground)", marginBottom: "10px" }}>{proj.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.55", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{proj.description}</p>
                  <span style={{ color: "var(--accent)", fontSize: "0.82rem", fontWeight: "600" }}>View Details -</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/projects" className="btn-secondary" style={{ padding: "12px 32px" }}>
            View Full Archive
          </Link>
        </div>
      </motion.div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
