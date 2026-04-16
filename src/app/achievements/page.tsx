export const dynamic = 'force-dynamic';
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata = {
  title: "All Achievements | Portfolio",
};

export default async function AchievementsArchivePage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      
      <div className="section-container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <h1 className="section-title" style={{ textAlign: "left", marginBottom: "16px" }}>All <span>Achievements</span></h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "48px", fontSize: "1.1rem" }}>A comprehensive timeline of my milestones, awards, and certifications.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "80px" }}>
          {achievements.map((item: any) => (
            <div 
              key={item.id}
              className="glass-card"
              style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", padding: "32px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "var(--accent)" }} />
              
              <div style={{ flex: "1 1 250px" }}>
                <span style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                  {item.date} • {item.type}
                </span>
                <h3 style={{ fontSize: "1.5rem", marginTop: "8px", marginBottom: "16px", color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                  {item.description}
                </p>
              </div>

              {item.imageUrl && (
                <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--glass-border)", flexShrink: 0, position: "relative" }}>
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
