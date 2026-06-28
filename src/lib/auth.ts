import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  // JWT session strategy: the session is stored in a signed JWT (no DB session
  // table needed), which is lightweight and ideal for serverless / Vercel.
  session: {
    strategy: "jwt"
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On initial sign-in attach a stable user id (Google subject).
      if (account && profile) {
        token.id = (profile as { sub?: string }).sub ?? token.sub;
      }
      if (user) {
        token.picture = token.picture ?? user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
      }
      return session;
    }
  }
};

/**
 * Server-side helper to read the current session in route handlers / RSC.
 */
export function getAuthSession() {
  return getServerSession(authOptions);
}
