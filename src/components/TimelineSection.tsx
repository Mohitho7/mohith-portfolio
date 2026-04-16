"use client";

import { motion } from "framer-motion";

export default function TimelineSection({ timelineItems }: { timelineItems: any[] }) {
  if (!timelineItems || timelineItems.length === 0) return null;

  return (
    <section id="timeline" className="section-container" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">The <span>Journey</span></h2>
        
        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          {/* Vertical Line */}
          <div style={{ position: "absolute", left: "24px", top: 0, bottom: 0, width: "2px", background: "var(--glass-border)" }} />
          
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {timelineItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ position: "relative", paddingLeft: "64px" }}
              >
                {/* Timeline Dot */}
                <div style={{ position: "absolute", left: "19px", top: "8px", width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent-glow)" }} />
                
                <h3 style={{ fontSize: "1.5rem", color: "var(--foreground)", marginBottom: "4px" }}>{item.title}</h3>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                  <span style={{ color: "var(--accent)" }}>{item.date}</span>
                  <span>•</span>
                  <span>{item.type}</span>
                </div>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
