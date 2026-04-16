import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { skillCategorySchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({ 
      include: { skills: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" } 
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = skillCategorySchema.safeParse(bodyResult.data);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const data = validation.data;
    const newCat = await prisma.skillCategory.create({ data });
    return NextResponse.json(newCat);
  } catch (error) {
    return serverErrorResponse("Failed to create category");
  }
}
