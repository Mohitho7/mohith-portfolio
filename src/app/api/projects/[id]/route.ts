import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import { projectSchema } from "@/lib/validations";
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
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    await connectDB();
    const existing = await Project.findById(idResult.data).lean();
    if (!existing) return notFoundResponse("Project");

    const partialValidation = projectSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) return validationErrorResponse(partialValidation.error);

    const dataValidation = projectSchema.safeParse({ ...existing, ...partialValidation.data });
    if (!dataValidation.success) return validationErrorResponse(dataValidation.error);

    const updated = await Project.findByIdAndUpdate(idResult.data, dataValidation.data, { new: true }).lean();
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ ...updated, id: (updated as any)._id.toString() });
  } catch {
    return serverErrorResponse("Failed to update project");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const deleted = await Project.findByIdAndDelete(idResult.data);
    if (!deleted) return notFoundResponse("Project");

    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete project");
  }
}
