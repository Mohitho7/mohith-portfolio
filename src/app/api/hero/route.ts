import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { heroSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst();
    return NextResponse.json(hero || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero text" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = heroSchema.safeParse(bodyResult.data);

    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const existing = await prisma.hero.findFirst();
    
    let updated;
    if (existing) {
      updated = await prisma.hero.update({ where: { id: existing.id }, data });
    } else {
      updated = await prisma.hero.create({ data });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return serverErrorResponse("Failed to update hero");
  }
}
