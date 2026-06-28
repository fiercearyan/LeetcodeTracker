import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Pattern } from "@/models/Pattern";
import { getAuthSession } from "@/lib/auth";
import { patternSchema } from "@/lib/validation";
import { ok, fail, unauthorized } from "@/lib/apiResponse";
import { serializePattern } from "@/lib/serialize";

/**
 * GET /api/patterns — list the authenticated user's patterns.
 */
export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  try {
    await connectToDatabase();
    const docs = await Pattern.find({ createdBy: session.user.id }).sort({
      updatedAt: -1
    });
    return ok(docs.map(serializePattern));
  } catch (error) {
    console.error("GET /api/patterns failed", error);
    return fail("Failed to load patterns", 500);
  }
}

/**
 * POST /api/patterns — create a pattern.
 */
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = patternSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();

    const duplicate = await Pattern.findOne({
      createdBy: session.user.id,
      name: new RegExp(`^${escapeRegex(parsed.data.name)}$`, "i")
    });
    if (duplicate) {
      return fail(`A pattern named "${parsed.data.name}" already exists`, 409);
    }

    const created = await Pattern.create({
      ...parsed.data,
      createdBy: session.user.id
    });
    return ok(serializePattern(created), 201);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return fail("A pattern with this name already exists", 409);
    }
    console.error("POST /api/patterns failed", error);
    return fail("Failed to create pattern", 500);
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
