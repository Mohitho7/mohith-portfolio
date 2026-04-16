export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "All Blogs | Portfolio",
};

export default async function BlogsArchivePage() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { date: "desc" }
  });

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      
      <div className="section-container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <h1 className="section-title" style={{ textAlign: "left", marginBottom: "16px" }}>The <span>Blog Archive</span></h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "48px", fontSize: "1.1rem" }}>All published thoughts, tutorials, and insights.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px", marginBottom: "80px" }}>
          {blogs.map((blog: any) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <div 
                className="glass-card hoverable-card"
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
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
