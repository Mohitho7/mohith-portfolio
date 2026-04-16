"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSafeNavigationHref } from "@/lib/url-safety";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HeroSection({ heroData }: { heroData: any }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Cycling identity from heroData.identityStatement as comma-separated roles
  const roles: string[] = (heroData?.identityStatement || "Full-Stack Developer,UI/UX Enthusiast,Problem Solver,Open Source Contributor")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, [roles.length]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      ref={ref}
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Soft ambient glow behind headline */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

      <motion.div
        style={{ y: textY, opacity: fadeOut, zIndex: 10, textAlign: "center", maxWidth: "780px", padding: "0 32px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* 1. Availability badge */}
        <AnimatePresence>
          {heroData?.isAvailable && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={mounted ? { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: EASE } } : {}}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.03)", borderRadius: "100px", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "32px", fontFamily: "var(--font-sans)", fontWeight: "500" }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px rgba(34,197,94,0.6)", flexShrink: 0 }} />
              Available for new projects
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Main headline — the dominant visual element */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={mounted ? { opacity: 1, y: 0, transition: { duration: 0.72, delay: 0.22, ease: EASE } } : {}}
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700", fontFamily: "var(--font-serif)", margin: 0, color: "var(--foreground)" }}
        >
          Hi, I&apos;m{" "}
          <span style={{ background: "linear-gradient(135deg, #d4af37 0%, #f5e27a 45%, #b8922a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {heroData?.name || "Mohith"}
          </span>
          .
        </motion.h1>

        {/* 3. Animated cycling identity label */}
        <div style={{ height: "36px", marginTop: "18px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              style={{ fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontFamily: "var(--font-sans)", fontWeight: "500", margin: 0, whiteSpace: "nowrap" }}
            >
              {roles[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 4. Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={mounted ? { opacity: 1, y: 0, transition: { duration: 0.72, delay: 0.44, ease: EASE } } : {}}
          style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "var(--text-muted)", maxWidth: "520px", marginTop: "20px", marginBottom: 0, textAlign: "center" }}
        >
          {heroData?.valueProposition || "I design and build products that feel inevitable. From first sketch to deployed product — end-to-end, with intention."}
        </motion.p>

        {/* 5. CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={mounted ? { opacity: 1, y: 0, transition: { duration: 0.72, delay: 0.54, ease: EASE } } : {}}
          style={{ display: "flex", gap: "14px", marginTop: "32px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href={getSafeNavigationHref(heroData?.ctaPrimaryLink, "/#projects")} className="btn-primary" style={{ padding: "13px 30px", fontSize: "0.92rem" }}>
            {heroData?.ctaPrimaryText || "See My Work"}
          </Link>
          <Link href={getSafeNavigationHref(heroData?.ctaSecondaryLink, "/#contact")} className="btn-secondary" style={{ padding: "13px 30px", fontSize: "0.92rem" }}>
            {heroData?.ctaSecondaryText || "Work With Me"}
          </Link>
        </motion.div>

        {/* 6. Scroll indicator CTA — Using custom text from admin */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1, transition: { delay: 1.8 } } : {}}
          style={{ marginTop: "48px" }}
        >
          <Link 
            href="/#about" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "8px", 
              textDecoration: "none",
            }}
          >
            <span style={{ 
              color: "var(--text-muted)", 
              fontSize: "0.68rem", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}>
              {heroData?.scrollCtaText || "Scroll"}
            </span>
            <div style={{ width: "1px", height: "44px", background: "linear-gradient(to bottom, rgba(212,175,55,0.6), transparent)", position: "relative", overflow: "hidden" }}>
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: 0, width: "1px", height: "50%", background: "var(--accent)" }}
              />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
