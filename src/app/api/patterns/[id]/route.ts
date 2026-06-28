import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { Pattern } from "@/models/Pattern";
import { getAuthSession } from "@/lib/auth";
import { patternUpdateSchema } from "@/lib/validation";
import { ok, fail, unauthorized, notFound } from "@/lib/apiResponse";
import { serializePattern } from "@/lib/serialize";

interface RouteContext {
  params: { id: string };
}

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * GET /api/patterns/:id — fetch one pattern and increment its view count.
 * The increment powers the "Most Viewed" sort.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid pattern id");

  try {
    await connectToDatabase();
    const doc = await Pattern.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!doc) return notFound("Pattern not found");
    return ok(serializePattern(doc));
  } catch (error) {
    console.error("GET /api/patterns/:id failed", error);
    return fail("Failed to load pattern", 500);
  }
}

/**
 * PUT /api/patterns/:id — update a pattern.
 */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid pattern id");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = patternUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();

    if (parsed.data.name !== undefined) {
      const duplicate = await Pattern.findOne({
        createdBy: session.user.id,
        name: new RegExp(`^${escapeRegex(parsed.data.name)}$`, "i"),
        _id: { $ne: params.id }
      });
      if (duplicate) {
        return fail(`A pattern named "${parsed.data.name}" already exists`, 409);
      }
    }

    const updated = await Pattern.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    if (!updated) return notFound("Pattern not found");
    return ok(serializePattern(updated));
  } catch (error) {
    console.error("PUT /api/patterns/:id failed", error);
    return fail("Failed to update pattern", 500);
  }
}

/**
 * DELETE /api/patterns/:id
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid pattern id");

  try {
    await connectToDatabase();
    const deleted = await Pattern.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!deleted) return notFound("Pattern not found");
    return ok({ _id: params.id });
  } catch (error) {
    console.error("DELETE /api/patterns/:id failed", error);
    return fail("Failed to delete pattern", 500);
  }
}
