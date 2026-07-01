import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Skill } from "@/lib/models";
import { skillSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = skillSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new Skill(validation.data).save();
    const obj = created.toJSON();
    revalidatePath("/");
    return NextResponse.json({ ...obj, id: obj._id?.toString() ?? obj.id, categoryId: obj.categoryId?.toString() });
  } catch {
    return serverErrorResponse("Failed to create skill");
  }
}
