import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const seedUsername = process.env.ADMIN_SEED_USERNAME?.trim();
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (seedUsername && seedPassword) {
    const hashedPassword = await bcrypt.hash(seedPassword, 12);

    const user = await prisma.user.upsert({
      where: { username: seedUsername },
      update: { password: hashedPassword },
      create: {
        username: seedUsername,
        password: hashedPassword,
      },
    });
    console.log("Admin user created/verified:", user.username);
  } else {
    console.warn(
      "Skipping admin seed user creation. Set ADMIN_SEED_USERNAME and ADMIN_SEED_PASSWORD to create one.",
    );
  }

  // 1. Hero section
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    await prisma.hero.create({
      data: {
        name: "Mohith",
        identityStatement: "Full Stack Engineer & UI/UX Designer",
        valueProposition:
          "I build premium digital experiences with modern web technologies, focusing on clean code and interactive storytelling.",
        ctaPrimaryText: "View Projects",
        ctaPrimaryLink: "#projects",
        ctaSecondaryText: "Contact Me",
        ctaSecondaryLink: "#contact",
        isAvailable: true,
        scrollCtaText: "Scroll",
      },
    });
    console.log("Seed: Hero section created.");
  } else {
    // Update existing one to have the new fields
    await prisma.hero.updateMany({
      data: {
        isAvailable: true,
        scrollCtaText: "Scroll",
      },
    });
    console.log("Seed: Hero section updated with defaults.");
  }

  // 2. About section
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        content: "I'm a passionate developer specializing in building beautiful, functional, and responsive web applications. I love turning complex problems into simple, elegant solutions.",
      },
    });
    console.log("Seed: About section created.");
  }

  // 3. Contact information
  const contactCount = await prisma.contact.count();
  if (contactCount === 0) {
    await prisma.contact.create({
      data: {
        email: "mohi756@gmail.com",
        github: "https://github.com/mohitho7",
        linkedin: "https://linkedin.com/in/mohith-mathukumalli",
        twitter: "https://twitter.com/mohitho7",
      },
    });
    console.log("Seed: Contact info created.");
  }

  // 4. Skills
  const skillCategoryCount = await prisma.skillCategory.count();
  if (skillCategoryCount === 0) {
    await prisma.skillCategory.create({
      data: {
        name: "Frontend Development",
        order: 1,
        skills: {
          create: [
            { name: "React", level: 5, order: 1 },
            { name: "Next.js", level: 5, order: 2 },
            { name: "TypeScript", level: 4, order: 3 },
            { name: "Tailwind CSS", level: 5, order: 4 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        name: "Backend Development",
        order: 2,
        skills: {
          create: [
            { name: "Node.js", level: 4, order: 1 },
            { name: "Prisma", level: 5, order: 2 },
            { name: "PostgreSQL", level: 4, order: 3 },
            { name: "API Design", level: 4, order: 4 },
          ],
        },
      },
    });
    console.log("Seed: Skills created.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
