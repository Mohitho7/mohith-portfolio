import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { testimonialSchema } from "@/lib/validations";
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
    const existing = await Testimonial.findById(idResult.data).lean();
    if (!existing) return notFoundResponse("Testimonial");

    const partialValidation = testimonialSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) return validationErrorResponse(partialValidation.error);

    const dataValidation = testimonialSchema.safeParse({ ...existing, ...partialValidation.data });
    if (!dataValidation.success) return validationErrorResponse(dataValidation.error);

    const updated = await Testimonial.findByIdAndUpdate(idResult.data, dataValidation.data, { new: true }).lean();
    revalidatePath("/");
    return NextResponse.json({ ...updated, id: (updated as any)._id.toString() });
  } catch {
    return serverErrorResponse("Failed to update testimonial");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const deleted = await Testimonial.findByIdAndDelete(idResult.data);
    if (!deleted) return notFoundResponse("Testimonial");

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete testimonial");
  }
}
