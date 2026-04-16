export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import BlogsSection from "@/components/BlogsSection";
import AboutSection, { AboutData } from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import TimelineSection from "@/components/TimelineSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default async function Home() {
  const [
    hero,
    projects,
    achievements,
    blogs,
    about,
    timeline,
    testimonials,
    contact,
    categories,
  ] = await Promise.all([
    prisma.hero.findFirst(),
    prisma.project.findMany({
      where: { isPinned: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.achievement.findMany({
      where: { isPinned: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.blog.findMany({
      where: { isPinned: true, isPublished: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.about.findFirst(),
    prisma.timelineItem.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.contact.findFirst(),
    prisma.skillCategory.findMany({
      include: { skills: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <HeroSection heroData={hero} />

      <AboutSection aboutData={about as AboutData} />

      {categories.length > 0 && <SkillsSection categories={categories} />}

      {projects.length > 0 && <ProjectsSection projects={projects} />}

      {timeline.length > 0 && <TimelineSection timelineItems={timeline} />}

      {achievements.length > 0 && (
        <AchievementsSection achievements={achievements} />
      )}

      {blogs.length > 0 && <BlogsSection blogs={blogs} />}

      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      <ContactSection contact={contact} />

      <Footer />
    </main>
  );
}
