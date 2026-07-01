import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
import { blogSchema } from "@/lib/validations";
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
    const existing = await Blog.findById(idResult.data).lean();
    if (!existing) return notFoundResponse("Blog");

    const partialValidation = blogSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) return validationErrorResponse(partialValidation.error);

    const dataValidation = blogSchema.safeParse({ ...existing, ...partialValidation.data });
    if (!dataValidation.success) return validationErrorResponse(dataValidation.error);

    const updated = await Blog.findByIdAndUpdate(idResult.data, dataValidation.data, { new: true }).lean();
    revalidatePath("/");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${idResult.data}`);
    return NextResponse.json({ ...updated, id: (updated as any)._id.toString() });
  } catch {
    return serverErrorResponse("Failed to update blog");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    await connectDB();
    const deleted = await Blog.findByIdAndDelete(idResult.data);
    if (!deleted) return notFoundResponse("Blog");

    revalidatePath("/");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${idResult.data}`);
    return NextResponse.json({ success: true });
  } catch {
    return serverErrorResponse("Failed to delete blog");
  }
}
