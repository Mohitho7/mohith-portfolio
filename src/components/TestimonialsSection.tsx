"use client";

import { motion } from "framer-motion";

export default function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-container" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Words of <span>Trust</span></h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {testimonials.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card"
              style={{ display: "flex", flexDirection: "column", padding: "32px", position: "relative" }}
            >
              <div style={{ color: "var(--accent)", fontSize: "3rem", lineHeight: "1", opacity: 0.3, position: "absolute", top: "24px", left: "24px", fontFamily: "var(--font-serif)" }}>"</div>
              
              <p style={{ color: "var(--foreground)", fontSize: "1.1rem", lineHeight: "1.6", fontStyle: "italic", marginBottom: "24px", position: "relative", zIndex: 1, paddingTop: "16px" }}>
                "{item.quote}"
              </p>
              
              <div style={{ marginTop: "auto" }}>
                <h4 style={{ fontSize: "1.1rem", color: "var(--accent)", marginBottom: "4px" }}>{item.authorName}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.authorRole} {item.authorContext ? `(${item.authorContext})` : ""}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
