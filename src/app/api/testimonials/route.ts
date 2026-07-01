import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { testimonialSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find().sort({ order: 1 }).lean();
    return NextResponse.json(items.map((t: any) => ({ ...t, id: t._id.toString() })));
  } catch {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = testimonialSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new Testimonial(validation.data).save();
    const obj = created.toJSON();
    revalidatePath("/");
    return NextResponse.json({ ...obj, id: obj._id?.toString() ?? obj.id });
  } catch {
    return serverErrorResponse("Failed to create testimonial");
  }
}
