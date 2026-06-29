import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { DesignPattern } from "@/models/DesignPattern";
import { getAuthSession } from "@/lib/auth";
import { designPatternSchema } from "@/lib/validation";
import { ok, fail, unauthorized } from "@/lib/apiResponse";
import { serializeDesignPattern } from "@/lib/serialize";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  try {
    await connectToDatabase();
    const docs = await DesignPattern.find({ createdBy: session.user.id }).sort({
      updatedAt: -1
    });
    return ok(docs.map(serializeDesignPattern));
  } catch (error) {
    console.error("GET /api/design-patterns failed", error);
    return fail("Failed to load design patterns", 500);
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

  const parsed = designPatternSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();
    const duplicate = await DesignPattern.findOne({
      createdBy: session.user.id,
      name: new RegExp(`^${escapeRegex(parsed.data.name)}$`, "i")
    });
    if (duplicate) {
      return fail(`A pattern named "${parsed.data.name}" already exists`, 409);
    }

    const created = await DesignPattern.create({
      ...parsed.data,
      createdBy: session.user.id
    });
    return ok(serializeDesignPattern(created), 201);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return fail("A design pattern with this name already exists", 409);
    }
    console.error("POST /api/design-patterns failed", error);
    return fail("Failed to create design pattern", 500);
  }
}
