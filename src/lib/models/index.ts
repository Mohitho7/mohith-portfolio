import mongoose, { Schema, model, models, Document, Types } from "mongoose";

// ─── Helper: normalize _id → id in JSON output ────────────────────────────
function toJSON(schema: Schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform(_doc: any, ret: Record<string, unknown>) {
      ret.id = (ret._id as Types.ObjectId).toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
  schema.set("toObject", { virtuals: true });
}

// ─── User ──────────────────────────────────────────────────────────────────
const userSchema = new Schema({
  email:         { type: String, unique: true, sparse: true },
  username:      { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  oauthProvider: { type: String },
  oauthId:       { type: String },
});
toJSON(userSchema);
export const User = models.User ?? model("User", userSchema);

// ─── Hero ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema({
  name:              { type: String, required: true },
  identityStatement: { type: String, required: true },
  valueProposition:  { type: String, required: true },
  ctaPrimaryText:    { type: String, default: "" },
  ctaPrimaryLink:    { type: String, default: "" },
  ctaSecondaryText:  { type: String, default: "" },
  ctaSecondaryLink:  { type: String, default: "" },
  isAvailable:       { type: Boolean, default: true },
  scrollCtaText:     { type: String, default: "Scroll" },
});
toJSON(heroSchema);
export const Hero = models.Hero ?? model("Hero", heroSchema);

// ─── Project ───────────────────────────────────────────────────────────────
const projectSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  techStack:   { type: String, required: true },
  outcome:     { type: String, required: true },
  demoLink:    { type: String },
  githubLink:  { type: String },
  imageUrl:    { type: String },
  isPinned:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
});
toJSON(projectSchema);
export const Project = models.Project ?? model("Project", projectSchema);

// ─── About ─────────────────────────────────────────────────────────────────
const aboutSchema = new Schema({
  content:  { type: String, required: true },
  imageUrl: { type: String },
});
toJSON(aboutSchema);
export const About = models.About ?? model("About", aboutSchema);

// ─── SkillCategory ─────────────────────────────────────────────────────────
const skillCategorySchema = new Schema({
  name:  { type: String, required: true },
  order: { type: Number, default: 0 },
});
toJSON(skillCategorySchema);
export const SkillCategory =
  models.SkillCategory ?? model("SkillCategory", skillCategorySchema);

// ─── Skill ─────────────────────────────────────────────────────────────────
const skillSchema = new Schema({
  name:       { type: String, required: true },
  level:      { type: Number, default: 5 },
  order:      { type: Number, default: 0 },
  categoryId: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true },
});
toJSON(skillSchema);
export const Skill = models.Skill ?? model("Skill", skillSchema);

// ─── TimelineItem ──────────────────────────────────────────────────────────
const timelineItemSchema = new Schema({
  title:       { type: String, required: true },
  type:        { type: String, required: true },
  date:        { type: String, required: true },
  description: { type: String, required: true },
  order:       { type: Number, default: 0 },
});
toJSON(timelineItemSchema);
export const TimelineItem =
  models.TimelineItem ?? model("TimelineItem", timelineItemSchema);

// ─── Achievement ───────────────────────────────────────────────────────────
const achievementSchema = new Schema({
  title:       { type: String, required: true },
  type:        { type: String, required: true },
  date:        { type: String, required: true },
  description: { type: String, required: true },
  imageUrl:    { type: String },
  isPinned:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
});
toJSON(achievementSchema);
export const Achievement =
  models.Achievement ?? model("Achievement", achievementSchema);

// ─── Blog ──────────────────────────────────────────────────────────────────
const blogSchema = new Schema({
  title:       { type: String, required: true },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  readingTime: { type: String, required: true },
  date:        { type: Date, default: Date.now },
  category:    { type: String, required: true },
  coverImage:  { type: String },
  isPinned:    { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
});
toJSON(blogSchema);
export const Blog = models.Blog ?? model("Blog", blogSchema);

// ─── Testimonial ───────────────────────────────────────────────────────────
const testimonialSchema = new Schema({
  quote:         { type: String, required: true },
  authorName:    { type: String, required: true },
  authorRole:    { type: String, required: true },
  authorContext: { type: String },
  order:         { type: Number, default: 0 },
});
toJSON(testimonialSchema);
export const Testimonial =
  models.Testimonial ?? model("Testimonial", testimonialSchema);

// ─── Contact ───────────────────────────────────────────────────────────────
const contactSchema = new Schema({
  email:    { type: String, required: true },
  linkedin: { type: String, required: true },
  github:   { type: String, required: true },
  twitter:  { type: String },
});
toJSON(contactSchema);
export const Contact = models.Contact ?? model("Contact", contactSchema);
