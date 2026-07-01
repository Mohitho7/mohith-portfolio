
import { connectDB } from "@/lib/mongodb";
import { Hero, Project, Achievement, Blog, About, TimelineItem, Testimonial, Contact, SkillCategory, Skill } from "@/lib/models";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import nextDynamic from "next/dynamic";

const ProjectsSection = nextDynamic(() => import("@/components/ProjectsSection"));
const AchievementsSection = nextDynamic(() => import("@/components/AchievementsSection"));
const BlogsSection = nextDynamic(() => import("@/components/BlogsSection"));
const AboutSection = nextDynamic(() => import("@/components/AboutSection"));
const SkillsSection = nextDynamic(() => import("@/components/SkillsSection"));
const TimelineSection = nextDynamic(() => import("@/components/TimelineSection"));
const TestimonialsSection = nextDynamic(() => import("@/components/TestimonialsSection"));
const ContactSection = nextDynamic(() => import("@/components/ContactSection"));
import Footer from "@/components/Footer";

export default async function Home() {
  await connectDB();

  const [
    hero,
    projects,
    achievements,
    blogs,
    about,
    timeline,
    testimonials,
    contact,
    rawCategories,
    rawSkills,
  ] = await Promise.all([
    Hero.findOne().lean(),
    Project.find({ isPinned: true }).sort({ order: 1 }).limit(3).lean(),
    Achievement.find({ isPinned: true }).sort({ order: 1 }).limit(3).lean(),
    Blog.find({ isPinned: true, isPublished: true }).sort({ order: 1 }).limit(3).lean(),
    About.findOne().lean(),
    TimelineItem.find().sort({ order: 1 }).lean(),
    Testimonial.find().sort({ order: 1 }).lean(),
    Contact.findOne().lean(),
    SkillCategory.find().sort({ order: 1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
  ]);

  // Manual join for skills → categories
  const categories = (rawCategories as any[]).map((cat) => ({
    ...cat,
    id: cat._id.toString(),
    skills: (rawSkills as any[])
      .filter((s) => s.categoryId?.toString() === cat._id.toString())
      .map((s) => ({ ...s, id: s._id.toString(), categoryId: s.categoryId?.toString() })),
  }));

  const serialize = (v: any) => JSON.parse(JSON.stringify(v));

  return (
    <main style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <HeroSection heroData={serialize(hero)} />

      <AboutSection aboutData={serialize(about)} />

      {categories.length > 0 && <SkillsSection categories={serialize(categories)} />}

      {projects.length > 0 && <ProjectsSection projects={serialize(projects)} />}

      {timeline.length > 0 && <TimelineSection timelineItems={serialize(timeline)} />}

      {achievements.length > 0 && (
        <AchievementsSection achievements={serialize(achievements)} />
      )}

      {blogs.length > 0 && <BlogsSection blogs={serialize(blogs)} />}

      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={serialize(testimonials)} />
      )}

      <ContactSection contact={serialize(contact)} />

      <Footer />
    </main>
  );
}
