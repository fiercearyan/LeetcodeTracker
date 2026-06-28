/**
 * Centralised access to environment variables.
 *
 * IMPORTANT: these getters must NOT throw at module-evaluation time.
 * Next.js imports route modules (including the NextAuth handler, which builds
 * `authOptions` at import) while "collecting page data" during `next build`.
 * Throwing here would fail the production build even though the variables are
 * present at runtime. Instead we return a safe empty string and validate
 * lazily, per-request, via `assertEnv` where it actually matters.
 */
function read(name: string): string {
  return process.env[name] ?? "";
}

/**
 * Runtime guard — call inside request handlers (not at import time) when a
 * variable is genuinely required, to surface a clear error.
 */
export function assertEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get MONGODB_URI() {
    return read("MONGODB_URI");
  },
  get NEXTAUTH_SECRET() {
    return read("NEXTAUTH_SECRET");
  },
  get GOOGLE_CLIENT_ID() {
    return read("GOOGLE_CLIENT_ID");
  },
  get GOOGLE_CLIENT_SECRET() {
    return read("GOOGLE_CLIENT_SECRET");
  }
};
