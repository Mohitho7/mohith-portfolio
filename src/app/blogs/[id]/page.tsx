import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  return { title: blog ? `${blog.title} | Portfolio` : "Blog Not Found" };
}

export default async function BlogSinglePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  
  if (!blog || !blog.isPublished) {
    notFound();
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      
      <article className="section-container" style={{ paddingTop: "150px", minHeight: "80vh", maxWidth: "800px" }}>
        {blog.coverImage && (
          <div style={{ width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", marginBottom: "40px", position: "relative" }}>
            <Image 
              src={blog.coverImage} 
              alt={blog.title} 
              fill
              priority
              sizes="(max-width: 800px) 100vw, 800px"
              style={{ objectFit: "cover" }} 
            />
          </div>
        )}
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px", color: "var(--accent)", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
          <span>{blog.category}</span>
          <span style={{ color: "var(--glass-border)" }}>|</span>
          <span style={{ color: "var(--text-muted)" }}>{blog.readingTime}</span>
        </div>
        
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "32px", color: "var(--foreground)", lineHeight: "1.2" }}>{blog.title}</h1>
        
        <div style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
          {/* Note: In a real app, this might parse Markdown using something like react-markdown */}
          {blog.content}
        </div>
      </article>

      <Footer />
    </main>
  );
}
