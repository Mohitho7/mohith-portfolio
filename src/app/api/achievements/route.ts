import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Achievement } from "@/lib/models";
import { achievementSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find().sort({ order: 1 }).lean();
    return NextResponse.json(achievements.map((a: any) => ({ ...a, id: a._id.toString() })));
  } catch {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = achievementSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new Achievement(validation.data).save();
    const obj = created.toJSON();
    revalidatePath("/");
    revalidatePath("/achievements");
    return NextResponse.json({ ...obj, id: obj._id?.toString() ?? obj.id });
  } catch {
    return serverErrorResponse("Failed to create achievement");
  }
}
