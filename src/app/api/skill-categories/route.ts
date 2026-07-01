import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { SkillCategory, Skill } from "@/lib/models";
import { skillCategorySchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    await connectDB();
    const categories = await SkillCategory.find().sort({ order: 1 }).lean();
    const skills = await Skill.find().sort({ order: 1 }).lean();

    // Manually "join" skills into their categories
    const result = categories.map((cat: any) => ({
      ...cat,
      id: cat._id.toString(),
      skills: skills
        .filter((s: any) => s.categoryId?.toString() === cat._id.toString())
        .map((s: any) => ({ ...s, id: s._id.toString(), categoryId: s.categoryId?.toString() })),
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = skillCategorySchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new SkillCategory(validation.data).save();
    const obj = created.toJSON();
    revalidatePath("/");
    return NextResponse.json({ ...obj, id: obj._id?.toString() ?? obj.id });
  } catch {
    return serverErrorResponse("Failed to create category");
  }
}
