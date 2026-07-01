import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { SkillCategory, Skill } from "@/lib/models";
import {
  invalidResourceIdResponse,
  notFoundResponse,
  requireAdminRequest,
  serverErrorResponse,
  validateResourceId,
} from "@/lib/api-security";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const existing = await SkillCategory.findById(idResult.data);
    if (!existing) return notFoundResponse("Skill category");

    // Delete all skills in this category first, then delete the category
    await Skill.deleteMany({ categoryId: idResult.data });
    await SkillCategory.findByIdAndDelete(idResult.data);

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete category");
  }
}
