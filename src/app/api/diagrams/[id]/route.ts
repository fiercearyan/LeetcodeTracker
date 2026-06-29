import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { Diagram } from "@/models/Diagram";
import { getAuthSession } from "@/lib/auth";
import { diagramUpdateSchema } from "@/lib/validation";
import { ok, fail, unauthorized, notFound } from "@/lib/apiResponse";
import { serializeDiagram } from "@/lib/serialize";

interface RouteContext {
  params: { id: string };
}

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid id");

  try {
    await connectToDatabase();
    const doc = await Diagram.findOne({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!doc) return notFound("Diagram not found");
    return ok(serializeDiagram(doc));
  } catch (error) {
    console.error("GET /api/diagrams/:id failed", error);
    return fail("Failed to load diagram", 500);
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

  const parsed = diagramUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();
    const updated = await Diagram.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $set: parsed.data },
      { new: true }
    );
    if (!updated) return notFound("Diagram not found");
    return ok(serializeDiagram(updated));
  } catch (error) {
    console.error("PUT /api/diagrams/:id failed", error);
    return fail("Failed to update diagram", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid id");

  try {
    await connectToDatabase();
    const deleted = await Diagram.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!deleted) return notFound("Diagram not found");
    return ok({ _id: params.id });
  } catch (error) {
    console.error("DELETE /api/diagrams/:id failed", error);
    return fail("Failed to delete diagram", 500);
  }
}
