import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Question } from "@/models/Question";
import { getAuthSession } from "@/lib/auth";
import { questionSchema } from "@/lib/validation";
import { ok, fail, unauthorized } from "@/lib/apiResponse";
import { serializeQuestion } from "@/lib/serialize";

/**
 * GET /api/questions
 * Returns every question belonging to the authenticated user.
 * Filtering / sorting / pagination is done client-side for snappy UX, but the
 * endpoint also accepts an optional `?sort=` query for server-side ordering.
 */
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user?.id) return unauthorized();

  try {
    await connectToDatabase();
    const sort = req.nextUrl.searchParams.get("sort") ?? "questionNumber";
    const order =
      req.nextUrl.searchParams.get("order") === "desc" ? -1 : 1;

    const docs = await Question.find({ createdBy: session.user.id })
      .sort({ [sort]: order })
      .lean({ virtuals: false });

    // lean() returns plain objects; re-shape them safely.
    const data = (docs as unknown as Parameters<typeof serializeQuestion>[0][])
      .map(serializeQuestion);
    return ok(data);
  } catch (error) {
    console.error("GET /api/questions failed", error);
    return fail("Failed to load questions", 500);
  }
}

/**
 * POST /api/questions
 * Creates a new question for the authenticated user.
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

  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten());
  }

  try {
    await connectToDatabase();

    const duplicate = await Question.findOne({
      createdBy: session.user.id,
      questionNumber: parsed.data.questionNumber
    });
    if (duplicate) {
      return fail(
        `Question #${parsed.data.questionNumber} already exists in your tracker`,
        409
      );
    }

    const created = await Question.create({
      ...parsed.data,
      createdBy: session.user.id
    });

    return ok(serializeQuestion(created), 201);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return fail("Duplicate question number for this user", 409);
    }
    console.error("POST /api/questions failed", error);
    return fail("Failed to create question", 500);
  }
}
