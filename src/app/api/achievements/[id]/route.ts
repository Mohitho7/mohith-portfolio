import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Achievement } from "@/lib/models";
import { achievementSchema } from "@/lib/validations";
import {
  invalidResourceIdResponse,
  notFoundResponse,
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
  validateResourceId,
} from "@/lib/api-security";

export async function PUT(
  pieces: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireAdminRequest(pieces, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const bodyResult = await readJsonBody(pieces);
    if (!bodyResult.ok) return bodyResult.response;

    await connectDB();
    const existing = await Achievement.findById(idResult.data).lean();
    if (!existing) return notFoundResponse("Achievement");

    const partialValidation = achievementSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) return validationErrorResponse(partialValidation.error);

    const dataValidation = achievementSchema.safeParse({ ...existing, ...partialValidation.data });
    if (!dataValidation.success) return validationErrorResponse(dataValidation.error);

    const updated = await Achievement.findByIdAndUpdate(idResult.data, dataValidation.data, { new: true }).lean();
    revalidatePath("/");
    revalidatePath("/achievements");
    return NextResponse.json({ ...updated, id: (updated as any)._id.toString() });
  } catch {
    return serverErrorResponse("Failed to update achievement");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const deleted = await Achievement.findByIdAndDelete(idResult.data);
    if (!deleted) return notFoundResponse("Achievement");

    revalidatePath("/");
    revalidatePath("/achievements");
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete achievement");
  }
}
