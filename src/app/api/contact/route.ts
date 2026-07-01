import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models";
import { contactSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne().lean();
    return NextResponse.json(contact ? { ...contact, id: (contact as any)._id.toString() } : {});
  } catch {
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = contactSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    const data = validation.data;
    await connectDB();
    const existing = await Contact.findOne();

    let result;
    if (existing) {
      result = await Contact.findByIdAndUpdate(existing._id, data, { new: true }).lean();
    } else {
      result = await new Contact(data).save();
      result = result.toJSON();
    }
    revalidatePath("/");
    return NextResponse.json({ ...result, id: (result as any)._id?.toString() ?? (result as any).id });
  } catch {
    return serverErrorResponse("Failed to update contact info");
  }
}
