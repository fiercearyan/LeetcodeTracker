import type { Metadata } from "next";
import { DiagramGallery } from "@/components/diagrams/DiagramGallery";

export const metadata: Metadata = {
  title: "Diagram Builder · Recall"
};

export default function DiagramsPage() {
  return <DiagramGallery />;
}
