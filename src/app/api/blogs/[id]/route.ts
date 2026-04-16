import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const partialValidation = blogSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) {
      return validationErrorResponse(partialValidation.error);
    }

    const existing = await prisma.blog.findUnique({ where: { id: idResult.data } });
    if (!existing) return notFoundResponse("Blog");

    const dataValidation = blogSchema.safeParse({
      ...existing,
      ...partialValidation.data,
    });
    if (!dataValidation.success) {
      return validationErrorResponse(dataValidation.error);
    }

    const updated = await prisma.blog.update({
      where: { id: idResult.data },
      data: dataValidation.data
    });
    return NextResponse.json(updated);
  } catch (error) {
    return serverErrorResponse("Failed to update blog");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const deleted = await prisma.blog.deleteMany({
      where: { id: idResult.data },
    });
    if (!deleted.count) return notFoundResponse("Blog");

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("Failed to delete blog");
  }
}
