import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const partialValidation = achievementSchema.partial().safeParse(bodyResult.data);
    if (!partialValidation.success) {
      return validationErrorResponse(partialValidation.error);
    }

    const existing = await prisma.achievement.findUnique({
      where: { id: idResult.data },
    });
    if (!existing) return notFoundResponse("Achievement");

    const dataValidation = achievementSchema.safeParse({
      ...existing,
      ...partialValidation.data,
    });
    if (!dataValidation.success) {
      return validationErrorResponse(dataValidation.error);
    }

    const updated = await prisma.achievement.update({
      where: { id: idResult.data },
      data: dataValidation.data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return serverErrorResponse("Failed to update achievement");
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = await requireAdminRequest(req);
    if (!authCheck.ok) return authCheck.response;

    const idResult = validateResourceId((await props.params).id);
    if (!idResult.success) return invalidResourceIdResponse();

    const deleted = await prisma.achievement.deleteMany({
      where: { id: idResult.data },
    });
    if (!deleted.count) return notFoundResponse("Achievement");

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("Failed to delete achievement");
  }
}
