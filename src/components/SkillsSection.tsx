"use client";

import { motion } from "framer-motion";

export default function SkillsSection({ categories }: { categories: any[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="skills" className="section-container" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Technical <span>Expertise</span></h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", alignItems: "start" }}>
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card"
              style={{ display: "flex", flexDirection: "column", padding: "32px" }}
            >
              <h3 style={{ fontSize: "1.3rem", color: "var(--foreground)", marginBottom: "24px", borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
                {cat.name}
              </h3>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {cat.skills.length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No skills listed.</span>}
                {cat.skills.map((skill: any) => (
                  <div key={skill.id} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "30px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
