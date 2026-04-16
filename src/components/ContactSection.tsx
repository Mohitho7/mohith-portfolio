"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getSafeExternalHref } from "@/lib/url-safety";

export default function ContactSection({ contact }: { contact: any }) {
  if (!contact) return null;

  const linkedinHref = getSafeExternalHref(contact.linkedin);
  const githubHref = getSafeExternalHref(contact.github);
  const twitterHref = getSafeExternalHref(contact.twitter);

  return (
    <section id="contact" className="section-container" style={{ paddingTop: "80px", paddingBottom: "120px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="glass-card"
        style={{ textAlign: "center", padding: "64px 24px", maxWidth: "800px", margin: "0 auto", background: "linear-gradient(180deg, rgba(26,27,33,0.4) 0%, rgba(212,175,55,0.05) 100%)" }}
      >
        <h2 style={{ fontSize: "2.5rem", fontFamily: "var(--font-serif)", marginBottom: "16px", color: "var(--foreground)" }}>Let's Build Together</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
        
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {contact.email && (
            <Link href={`mailto:${contact.email}`} className="btn-primary" style={{ padding: "12px 32px" }}>
              Say Hello
            </Link>
          )}
          {linkedinHref && (
            <Link href={linkedinHref} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "12px 32px" }}>
              LinkedIn
            </Link>
          )}
          {githubHref && (
            <Link href={githubHref} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "12px 32px" }}>
              GitHub
            </Link>
          )}
          {twitterHref && (
            <Link href={twitterHref} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "12px 32px", border: "none", textDecoration: "underline" }}>
              Twitter / X
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}
