import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--glass-border)", padding: "32px 24px", backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} Portfolio. Designed & Built with passion.
        </p>
        <Link href="/admin/login" style={{ color: "var(--text-muted)", fontSize: "0.8rem", opacity: 0.5 }}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
