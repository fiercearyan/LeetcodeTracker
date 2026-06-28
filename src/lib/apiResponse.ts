import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  );
}

export const unauthorized = () => fail("Unauthorized", 401);
export const notFound = (message = "Resource not found") => fail(message, 404);
