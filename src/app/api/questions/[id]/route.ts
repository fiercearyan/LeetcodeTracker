import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { Question } from "@/models/Question";
import { getAuthSession } from "@/lib/auth";
import { questionUpdateSchema } from "@/lib/validation";
import { ok, fail, unauthorized, notFound } from "@/lib/apiResponse";
import { serializeQuestion } from "@/lib/serialize";

interface RouteContext {
  params: { id: string };
}

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/questions/:id
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid question id");

  try {
    await connectToDatabase();
    const doc = await Question.findOne({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!doc) return notFound("Question not found");
    return ok(serializeQuestion(doc));
  } catch (error) {
    console.error("GET /api/questions/:id failed", error);
    return fail("Failed to load question", 500);
  }
}

/**
 * PUT /api/questions/:id
 */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid question id");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = questionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();

    // If the question number is changing, guard against duplicates.
    if (parsed.data.questionNumber !== undefined) {
      const duplicate = await Question.findOne({
        createdBy: session.user.id,
        questionNumber: parsed.data.questionNumber,
        _id: { $ne: params.id }
      });
      if (duplicate) {
        return fail(
          `Question #${parsed.data.questionNumber} already exists in your tracker`,
          409
        );
      }
    }

    const updated = await Question.findOneAndUpdate(
      { _id: params.id, createdBy: session.user.id },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!updated) return notFound("Question not found");
    return ok(serializeQuestion(updated));
  } catch (error) {
    console.error("PUT /api/questions/:id failed", error);
    return fail("Failed to update question", 500);
  }
}

/**
 * DELETE /api/questions/:id
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();
  if (!isValidId(params.id)) return fail("Invalid question id");

  try {
    await connectToDatabase();
    const deleted = await Question.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id
    });
    if (!deleted) return notFound("Question not found");
    return ok({ _id: params.id });
  } catch (error) {
    console.error("DELETE /api/questions/:id failed", error);
    return fail("Failed to delete question", 500);
  }
}
