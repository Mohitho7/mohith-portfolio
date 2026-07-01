import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Hero } from "@/lib/models";
import { heroSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    await connectDB();
    const hero = await Hero.findOne().lean();
    return NextResponse.json(hero ? { ...hero, id: (hero as any)._id.toString() } : {});
  } catch {
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
    if (!validation.success) return validationErrorResponse(validation.error);

    const data = validation.data;
    await connectDB();
    const existing = await Hero.findOne();

    let result;
    if (existing) {
      result = await Hero.findByIdAndUpdate(existing._id, data, { new: true }).lean();
    } else {
      result = await new Hero(data).save();
      result = result.toJSON();
    }
    revalidatePath("/");
    return NextResponse.json({ ...result, id: (result as any)._id?.toString() ?? (result as any).id });
  } catch {
    return serverErrorResponse("Failed to update hero");
  }
}
