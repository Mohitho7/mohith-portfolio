import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = skillSchema.safeParse(bodyResult.data);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const newSkill = await prisma.skill.create({ data });
    return NextResponse.json(newSkill);
  } catch (error) {
    return serverErrorResponse("Failed to create skill");
  }
}
