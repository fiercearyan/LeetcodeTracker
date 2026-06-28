import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  return <DashboardShell>{children}</DashboardShell>;
}
