import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blogSchema } from "@/lib/validations";
import {
  readJsonBody,
  requireAdminRequest,
  serverErrorResponse,
  validationErrorResponse,
} from "@/lib/api-security";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    const filter = session ? {} : { isPublished: true };
    const sort: any = session ? { date: -1 } : { order: 1 };
    const blogs = await Blog.find(filter).sort(sort).lean();
    return NextResponse.json(blogs.map((b: any) => ({ ...b, id: b._id.toString() })));
  } catch {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await requireAdminRequest(req, { expectsJsonBody: true });
    if (!authCheck.ok) return authCheck.response;

    const bodyResult = await readJsonBody(req);
    if (!bodyResult.ok) return bodyResult.response;

    const validation = blogSchema.safeParse(bodyResult.data);
    if (!validation.success) return validationErrorResponse(validation.error);

    await connectDB();
    const created = await new Blog(validation.data).save();
    const obj = created.toJSON();
    revalidatePath("/");
    revalidatePath("/blogs");
    return NextResponse.json({ ...obj, id: obj._id?.toString() ?? obj.id });
  } catch {
    return serverErrorResponse("Failed to create blog");
  }
}
