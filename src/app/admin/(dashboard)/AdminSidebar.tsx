"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    startTransition(() => {
      setIsOpen(false);
    });
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <header className={styles.mobileHeader}>
        <Link href="/admin">
          <h2>Admin Panel</h2>
        </Link>
        <button
          className={styles.hamburgerBtn}
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.show : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin">
            <h2>Admin Panel</h2>
          </Link>
          {/* Optional: close button inside sidebar for mobile */}
        </div>
        <nav className={styles.navLinks}>
          <Link
            href="/admin"
            className={pathname === "/admin" ? styles.active : ""}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/hero"
            className={pathname === "/admin/hero" ? styles.active : ""}
          >
            Hero Section
          </Link>
          <Link
            href="/admin/projects"
            className={
              pathname?.startsWith("/admin/projects") ? styles.active : ""
            }
          >
            Projects
          </Link>
          <Link
            href="/admin/about"
            className={pathname === "/admin/about" ? styles.active : ""}
          >
            About
          </Link>
          <Link
            href="/admin/skills"
            className={pathname === "/admin/skills" ? styles.active : ""}
          >
            Skills
          </Link>
          <Link
            href="/admin/timeline"
            className={pathname === "/admin/timeline" ? styles.active : ""}
          >
            Timeline
          </Link>
          <Link
            href="/admin/achievements"
            className={pathname === "/admin/achievements" ? styles.active : ""}
          >
            Achievements
          </Link>
          <Link
            href="/admin/blogs"
            className={
              pathname?.startsWith("/admin/blogs") ? styles.active : ""
            }
          >
            Blogs
          </Link>
          <Link
            href="/admin/testimonials"
            className={pathname === "/admin/testimonials" ? styles.active : ""}
          >
            Testimonials
          </Link>
          <Link
            href="/admin/contact"
            className={pathname === "/admin/contact" ? styles.active : ""}
          >
            Contact Info
          </Link>
          <div className={styles.navDivider}></div>
          <Link href="/api/auth/signout" prefetch={false}>
            Sign Out
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View Live Site -&gt;
          </Link>
        </nav>
      </aside>
    </>
  );
}
