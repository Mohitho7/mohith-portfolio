import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const existing = await prisma.skillCategory.findUnique({
      where: { id: idResult.data },
    });
    if (!existing) return notFoundResponse("Skill category");

    await prisma.$transaction([
      prisma.skill.deleteMany({ where: { categoryId: idResult.data } }),
      prisma.skillCategory.delete({ where: { id: idResult.data } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return serverErrorResponse("Failed to delete category");
  }
}
