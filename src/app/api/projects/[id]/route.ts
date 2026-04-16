

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const partialValidation = projectSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) {
      return validationErrorResponse(partialValidation.error);
    }

    const existing = await prisma.project.findUnique({
      where: { id: idResult.data },
    });
    if (!existing) return notFoundResponse("Project");

    const dataValidation = projectSchema.safeParse({
      ...existing,
      ...partialValidation.data,
    });
    if (!dataValidation.success) {
      return validationErrorResponse(dataValidation.error);
    }

    const updated = await prisma.project.update({
      where: { id: idResult.data },
      data: dataValidation.data
    });
    return NextResponse.json(updated);
  } catch (error) {
    return serverErrorResponse("Failed to update project");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const deleted = await prisma.project.deleteMany({
      where: { id: idResult.data },
    });
    if (!deleted.count) return notFoundResponse("Project");

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("Failed to delete project");
  }
}
