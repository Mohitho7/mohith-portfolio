"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    handleScroll();
    handleResize();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Work", href: "/#projects" },
    { name: "Journey", href: "/#timeline" },
    { name: "Blog", href: "/#blogs" },
  ];

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.3 },
    }),
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile 
            ? (scrolled ? "12px 24px" : "20px 24px") 
            : (scrolled ? "16px 48px" : "24px 48px"),
          background: scrolled ? "rgba(10,10,10,0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Logo */}
        <Link 
          href="/" 
          style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.5px" }}
          onClick={() => setIsOpen(false)}
        >
          PORTFOLIO<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "40px", fontSize: "0.88rem", fontWeight: "500", letterSpacing: "0.02em" }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                style={{ transition: "color 0.3s ease" }}
                className="nav-link-hover"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Section: Contact (Desktop) or Toggle (Mobile) */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {!isMobile && (
            <Link href="/#contact" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.88rem" }}>
              Contact
            </Link>
          )}

          {isMobile && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              style={{ 
                background: "transparent", 
                border: "none", 
                color: "white", 
                cursor: "pointer",
                padding: "8px",
                zIndex: 101,
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
              aria-label="Toggle Menu"
            >
              <motion.span 
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                style={{ width: "24px", height: "2px", background: "white", display: "block" }} 
              />
              <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                style={{ width: "24px", height: "2px", background: "white", display: "block" }} 
              />
              <motion.span 
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                style={{ width: "24px", height: "2px", background: "white", display: "block" }} 
              />
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100vh",
              background: "rgba(5, 5, 5, 0.98)",
              backdropFilter: "blur(30px)",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.name} custom={i} variants={linkVariants}>
                <Link 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    fontSize: "2.5rem", 
                    fontWeight: "600", 
                    color: "white",
                    letterSpacing: "-1px"
                  }}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div custom={navLinks.length} variants={linkVariants}>
              <Link 
                href="/#contact" 
                onClick={() => setIsOpen(false)}
                className="btn-primary"
                style={{ padding: "16px 40px", fontSize: "1.1rem" }}
              >
                Let&apos;s Connect
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
