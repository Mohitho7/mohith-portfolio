"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function BlogsSection({ blogs }: { blogs: any[] }) {
  return (
    <section id="blogs" className="section-container" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Latest <span>Writings</span></h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px", marginBottom: "40px" }}>
          {blogs.map((blog, idx) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card"
                style={{ display: "flex", flexDirection: "column", height: "100%", cursor: "pointer" }}
              >
                {blog.coverImage && (
                  <div style={{ width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", background: "rgba(0,0,0,0.5)", position: "relative" }}>
                    <Image 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }} 
                      className="hover-scale-img" 
                    />
                  </div>
                )}
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{blog.category}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{blog.readingTime}</span>
                </div>
                
                <h3 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "var(--foreground)", lineHeight: "1.4" }}>{blog.title}</h3>
                
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", flex: 1 }}>{blog.excerpt}</p>
                
                <div style={{ marginTop: "24px", color: "var(--accent)", fontWeight: "500", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  Read Article →
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div style={{ textAlign: "center" }}>
          <Link href="/blogs" className="btn-secondary" style={{ padding: "12px 32px" }}>
            Read More Articles
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
