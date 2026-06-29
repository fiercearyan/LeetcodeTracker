import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { DesignPattern } from "@/models/DesignPattern";
import { getAuthSession } from "@/lib/auth";
import { designPatternUpdateSchema } from "@/lib/validation";
import { ok, fail, unauthorized, notFound } from "@/lib/apiResponse";
import { serializeDesignPattern } from "@/lib/serialize";
import type { RelatedDesignPattern } from "@/types/designPattern";

interface RouteContext {
  params: { id: string };
}

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);
const escapeRegex = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid id");

  try {
    await connectToDatabase();
    const doc = await DesignPattern.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!doc) return notFound("Design pattern not found");

    // Resolve related pattern summaries.
    const related = doc.relatedPatterns?.length
      ? await DesignPattern.find({
          _id: { $in: doc.relatedPatterns },
          createdBy: session.user.id
        })
          .select("name type")
          .lean()
      : [];

    const relatedPatternDetails: RelatedDesignPattern[] = related.map((r) => ({
      _id: String(r._id),
      name: r.name as string,
      type: r.type as RelatedDesignPattern["type"]
    }));

    return ok({ ...serializeDesignPattern(doc), relatedPatternDetails });
  } catch (error) {
    console.error("GET /api/design-patterns/:id failed", error);
    return fail("Failed to load design pattern", 500);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid id");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = designPatternUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();

    if (parsed.data.name !== undefined) {
      const duplicate = await DesignPattern.findOne({
        createdBy: session.user.id,
        name: new RegExp(`^${escapeRegex(parsed.data.name)}$`, "i"),
        _id: { $ne: params.id }
      });
      if (duplicate) {
        return fail(`A pattern named "${parsed.data.name}" already exists`, 409);
      }
    }

    const updated = await DesignPattern.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    if (!updated) return notFound("Design pattern not found");
    return ok(serializeDesignPattern(updated));
  } catch (error) {
    console.error("PUT /api/design-patterns/:id failed", error);
    return fail("Failed to update design pattern", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid id");

  try {
    await connectToDatabase();
    const deleted = await DesignPattern.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!deleted) return notFound("Design pattern not found");
    // Clean up references from other patterns.
    await DesignPattern.updateMany(
      { createdBy: session.user.id, relatedPatterns: params.id },
      { $pull: { relatedPatterns: params.id } }
    );
    return ok({ _id: params.id });
  } catch (error) {
    console.error("DELETE /api/design-patterns/:id failed", error);
    return fail("Failed to delete design pattern", 500);
  }
}
