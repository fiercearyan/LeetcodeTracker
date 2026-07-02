import type { Metadata } from "next";
import { RevisionLibrary } from "@/components/revision/RevisionLibrary";

export const metadata: Metadata = {
  title: "Project Revision · Recall"
};

export default function ProjectRevisionPage() {
  return <RevisionLibrary />;
}
