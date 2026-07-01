import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set in .env");
  process.exit(1);
}

// ─── Inline schemas (avoids Next.js module issues) ─────────────────────────
const UserSchema = new mongoose.Schema({ username: String, email: String, password: String });
const HeroSchema = new mongoose.Schema({
  name: String, identityStatement: String, valueProposition: String,
  ctaPrimaryText: String, ctaPrimaryLink: String,
  ctaSecondaryText: String, ctaSecondaryLink: String,
  isAvailable: { type: Boolean, default: true }, scrollCtaText: String,
});
const AboutSchema = new mongoose.Schema({ content: String, imageUrl: String });
const ContactSchema = new mongoose.Schema({ email: String, linkedin: String, github: String, twitter: String });
const SkillCategorySchema = new mongoose.Schema({ name: String, order: Number });
const SkillSchema = new mongoose.Schema({
  name: String, level: Number, order: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SkillCategory" },
});

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
const Hero = mongoose.models.Hero ?? mongoose.model("Hero", HeroSchema);
const About = mongoose.models.About ?? mongoose.model("About", AboutSchema);
const Contact = mongoose.models.Contact ?? mongoose.model("Contact", ContactSchema);
const SkillCategory = mongoose.models.SkillCategory ?? mongoose.model("SkillCategory", SkillCategorySchema);
const Skill = mongoose.models.Skill ?? mongoose.model("Skill", SkillSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // 1. Admin user
  const seedUsername = process.env.ADMIN_SEED_USERNAME?.trim();
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (seedUsername && seedPassword) {
    const hashed = await bcrypt.hash(seedPassword, 12);
    await User.findOneAndUpdate(
      { username: seedUsername },
      { username: seedUsername, password: hashed },
      { upsert: true, new: true }
    );
    console.log("✅ Admin user seeded:", seedUsername);
  } else {
    console.warn("⚠️  Skipping admin seed. Set ADMIN_SEED_USERNAME and ADMIN_SEED_PASSWORD.");
  }

  // 2. Hero
  const heroCount = await Hero.countDocuments();
  if (heroCount === 0) {
    await new Hero({
      name: "Mohith",
      identityStatement: "Full Stack Engineer & UI/UX Designer",
      valueProposition: "I build premium digital experiences with modern web technologies, focusing on clean code and interactive storytelling.",
      ctaPrimaryText: "View Projects",
      ctaPrimaryLink: "#projects",
      ctaSecondaryText: "Contact Me",
      ctaSecondaryLink: "#contact",
      isAvailable: true,
      scrollCtaText: "Scroll",
    }).save();
    console.log("✅ Hero section seeded.");
  }

  // 3. About
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await new About({
      content: "I'm a passionate developer specializing in building beautiful, functional, and responsive web applications. I love turning complex problems into simple, elegant solutions.",
    }).save();
    console.log("✅ About section seeded.");
  }

  // 4. Contact
  const contactCount = await Contact.countDocuments();
  if (contactCount === 0) {
    await new Contact({
      email: "mohi756@gmail.com",
      github: "https://github.com/mohitho7",
      linkedin: "https://linkedin.com/in/mohith-mathukumalli",
      twitter: "https://twitter.com/mohitho7",
    }).save();
    console.log("✅ Contact info seeded.");
  }

  // 5. Skills
  const catCount = await SkillCategory.countDocuments();
  if (catCount === 0) {
    const fe = await new SkillCategory({ name: "Frontend Development", order: 1 }).save();
    const be = await new SkillCategory({ name: "Backend Development", order: 2 }).save();

    await Skill.insertMany([
      { name: "React", level: 5, order: 1, categoryId: fe._id },
      { name: "Next.js", level: 5, order: 2, categoryId: fe._id },
      { name: "TypeScript", level: 4, order: 3, categoryId: fe._id },
      { name: "Tailwind CSS", level: 5, order: 4, categoryId: fe._id },
      { name: "Node.js", level: 4, order: 1, categoryId: be._id },
      { name: "MongoDB", level: 5, order: 2, categoryId: be._id },
      { name: "API Design", level: 4, order: 3, categoryId: be._id },
    ]);
    console.log("✅ Skills seeded.");
  }

  await mongoose.disconnect();
  console.log("🎉 Seed complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
