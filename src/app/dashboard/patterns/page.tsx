import type { Metadata } from "next";
import { PatternLibrary } from "@/components/patterns/PatternLibrary";

export const metadata: Metadata = {
  title: "Pattern Library · LeetCode Tracker"
};

export default function PatternsPage() {
  return <PatternLibrary />;
}
