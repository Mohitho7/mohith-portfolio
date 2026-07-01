"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface AboutData {
  content: string;
  imageUrl?: string;
}
export default function AboutSection<T extends AboutData>({
  aboutData,
}: {
  aboutData: T;
}) {
  if (!aboutData || !aboutData.content) return null;

  return (
    <section
      id="about"
      className="section-container"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">
          My <span>Story</span>
        </h2>

        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {aboutData.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ flex: "1 1 300px", maxWidth: "400px", margin: "0 auto" }}
            >
              <div
                className="glass-card"
                style={{ padding: "8px", borderRadius: "24px" }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    src={aboutData.imageUrl} 
                    alt="About Me"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ flex: "2 1 400px" }}
          >
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "1.15rem",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
              }}
            >
              {aboutData.content}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
