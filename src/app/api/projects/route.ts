import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import { projectSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

function lean(doc: any) {
  if (!doc) return doc;
  const obj = doc.toJSON ? doc.toJSON() : doc;
  return { ...obj, id: obj._id?.toString() ?? obj.id };
}

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1 }).lean();
    return NextResponse.json(projects.map((p: any) => ({ ...p, id: p._id.toString() })));
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = projectSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new Project(validation.data).save();
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json(lean(created));
  } catch {
    return serverErrorResponse("Failed to create project");
  }
}
