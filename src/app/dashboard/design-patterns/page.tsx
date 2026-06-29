import type { Metadata } from "next";
import { DesignPatternsLibrary } from "@/components/design-patterns/DesignPatternsLibrary";

export const metadata: Metadata = {
  title: "Design Patterns · Recall"
};

export default function DesignPatternsPage() {
  return <DesignPatternsLibrary />;
}
