import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { LoginCard } from "@/components/auth/LoginCard";

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session) redirect("/dashboard/questions");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]" />
      <LoginCard />
    </main>
  );
}
