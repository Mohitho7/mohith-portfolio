"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AchievementsSection({ achievements }: { achievements: any[] }) {
  return (
    <section id="achievements" className="section-container" style={{ paddingTop: "60px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Milestones & <span>Achievements</span></h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
          {achievements.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-card"
              style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", padding: "32px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "var(--accent)" }} />
              
              <div style={{ flex: "1 1 250px" }}>
                <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {item.date} • {item.type}
                </span>
                <h3 style={{ fontSize: "1.5rem", marginTop: "8px", marginBottom: "16px", color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                  {item.description}
                </p>
              </div>

              {item.imageUrl && (
                <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--glass-border)", flexShrink: 0, position: "relative" }}>
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div style={{ textAlign: "center" }}>
          <Link href="/achievements" className="btn-secondary" style={{ padding: "12px 32px" }}>
            View All Achievements
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
