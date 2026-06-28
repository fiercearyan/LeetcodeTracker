/**
 * Centralised, validated access to environment variables.
 * Throwing early gives clear errors instead of obscure runtime failures.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get MONGODB_URI() {
    return required("MONGODB_URI");
  },
  get NEXTAUTH_SECRET() {
    return required("NEXTAUTH_SECRET");
  },
  get GOOGLE_CLIENT_ID() {
    return required("GOOGLE_CLIENT_ID");
  },
  get GOOGLE_CLIENT_SECRET() {
    return required("GOOGLE_CLIENT_SECRET");
  }
};
