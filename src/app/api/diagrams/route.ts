import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Diagram } from "@/models/Diagram";
import { getAuthSession } from "@/lib/auth";
import { diagramSchema } from "@/lib/validation";
import { ok, fail, unauthorized } from "@/lib/apiResponse";
import { serializeDiagram } from "@/lib/serialize";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  try {
    await connectToDatabase();
    // List view omits heavy node/edge graphs for speed.
    const docs = await Diagram.find({ createdBy: session.user.id }).sort({
      updatedAt: -1
    });
    return ok(docs.map(serializeDiagram));
  } catch (error) {
    console.error("GET /api/diagrams failed", error);
    return fail("Failed to load diagrams", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = diagramSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();
    const created = await Diagram.create({
      ...parsed.data,
      createdBy: session.user.id
    });
    return ok(serializeDiagram(created), 201);
  } catch (error) {
    console.error("POST /api/diagrams failed", error);
    return fail("Failed to create diagram", 500);
  }
}
