import { z } from "zod";
import {
  isSafeAssetUrl,
  isSafeHttpUrl,
  isSafeNavigationHref,
} from "@/lib/url-safety";

const safeHttpUrlSchema = z
  .string()
  .trim()
  .url("Invalid URL")
  .refine((value) => isSafeHttpUrl(value), {
    message: "URL must use http or https",
  });

const optionalSafeHttpUrlSchema = safeHttpUrlSchema.optional().or(z.literal(""));

const safeAssetUrlSchema = z
  .string()
  .trim()
  .refine((value) => isSafeAssetUrl(value), {
    message: "URL must be a safe local path or http/https URL",
  });

const optionalSafeAssetUrlSchema = safeAssetUrlSchema.optional().or(z.literal(""));

const safeNavigationHrefSchema = z
  .string()
  .trim()
  .refine((value) => isSafeNavigationHref(value), {
    message: "Link must be an anchor, internal path, or http/https URL",
  });

const optionalSafeNavigationHrefSchema = safeNavigationHrefSchema
  .optional()
  .or(z.literal(""));

export const idParamSchema = z.string().trim().cuid("Invalid resource ID");

export const heroSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  identityStatement: z.string().trim().min(1, "Identity statement is required"),
  valueProposition: z.string().trim().min(1, "Value proposition is required"),
  ctaPrimaryText: z.string().trim().default(""),
  ctaPrimaryLink: optionalSafeNavigationHrefSchema.default(""),
  ctaSecondaryText: z.string().trim().default(""),
  ctaSecondaryLink: optionalSafeNavigationHrefSchema.default(""),
  isAvailable: z.boolean().default(true),
  scrollCtaText: z.string().trim().default("Scroll"),
});

export const contactSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  linkedin: safeHttpUrlSchema,
  github: safeHttpUrlSchema,
  twitter: optionalSafeHttpUrlSchema,
});

export const aboutSchema = z.object({
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  imageUrl: optionalSafeAssetUrlSchema,
});

export const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.string().trim().min(1, "Type is required"),
  date: z.string().trim().min(1, "Date is required"),
  description: z.string().trim().min(1, "Description is required"),
  imageUrl: optionalSafeAssetUrlSchema,
  isPinned: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  techStack: z.string().trim().min(1, "Tech stack is required"),
  outcome: z.string().trim().min(1, "Outcome is required"),
  demoLink: optionalSafeHttpUrlSchema,
  githubLink: optionalSafeHttpUrlSchema,
  imageUrl: optionalSafeAssetUrlSchema,
  isPinned: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  content: z.string().trim().min(1, "Content is required"),
  readingTime: z.string().trim().min(1, "Reading time is required"),
  category: z.string().trim().min(1, "Category is required"),
  coverImage: optionalSafeAssetUrlSchema,
  isPinned: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const skillCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  level: z.number().int().min(1).max(10).default(5),
  order: z.number().int().default(0),
  categoryId: z.string().cuid("Invalid category ID"),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(1, "Quote is required"),
  authorName: z.string().trim().min(1, "Author name is required"),
  authorRole: z.string().trim().min(1, "Author role is required"),
  authorContext: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
});

export const timelineItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.string().trim().min(1, "Type is required (education, internship, etc.)"),
  date: z.string().trim().min(1, "Date is required"),
  description: z.string().trim().min(1, "Description is required"),
  order: z.number().int().default(0),
});
