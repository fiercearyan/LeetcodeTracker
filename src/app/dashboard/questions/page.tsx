import type { Metadata } from "next";
import { QuestionTracker } from "@/components/questions/QuestionTracker";

export const metadata: Metadata = {
  title: "Question Tracker · LeetCode Tracker"
};

export default function QuestionsPage() {
  return <QuestionTracker />;
}
