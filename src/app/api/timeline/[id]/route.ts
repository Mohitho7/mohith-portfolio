import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { TimelineItem } from "@/lib/models";
import { timelineItemSchema } from "@/lib/validations";
import {
  invalidResourceIdResponse,
  notFoundResponse,
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
  validateResourceId,
} from "@/lib/api-security";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    await connectDB();
    const existing = await TimelineItem.findById(idResult.data).lean();
    if (!existing) return notFoundResponse("Timeline item");

    const partialValidation = timelineItemSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) return validationErrorResponse(partialValidation.error);

    const dataValidation = timelineItemSchema.safeParse({ ...existing, ...partialValidation.data });
    if (!dataValidation.success) return validationErrorResponse(dataValidation.error);

    const updated = await TimelineItem.findByIdAndUpdate(idResult.data, dataValidation.data, { new: true }).lean();
    revalidatePath("/");
    return NextResponse.json({ ...updated, id: (updated as any)._id.toString() });
  } catch {
    return serverErrorResponse("Failed to update timeline item");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const deleted = await TimelineItem.findByIdAndDelete(idResult.data);
    if (!deleted) return notFoundResponse("Timeline item");

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete timeline item");
  }
}
