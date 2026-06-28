/**
 * Seed script — populates the database with a handful of sample questions.
 *
 * Usage:
 *   1. Ensure MONGODB_URI is set (see .env).
 *   2. Optionally set SEED_USER_ID to attach the data to a specific user
 *      (defaults to "seed-user"). Use your Google subject id to see them in
 *      the app, or just browse with the seed user via a quick DB tweak.
 *   3. Run: npm run seed
 */
import "dotenv/config";
import mongoose from "mongoose";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const QuestionSchema = new mongoose.Schema(
  {
    questionNumber: Number,
    questionName: String,
    difficulty: { type: String, enum: DIFFICULTIES },
    topics: [String],
    leetcodeUrl: String,
    approach: String,
    patterns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pattern" }],
    createdBy: String
  },
  { timestamps: true }
);
QuestionSchema.index({ createdBy: 1, questionNumber: 1 }, { unique: true });

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

const PatternSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    tags: [String],
    triggerKeywords: [String],
    notes: String,
    template: String,
    mentalChecklist: [String],
    complexities: [{ _id: false, operation: String, complexity: String }],
    views: { type: Number, default: 0 },
    createdBy: String
  },
  { timestamps: true }
);
PatternSchema.index({ createdBy: 1, name: 1 }, { unique: true });

const Pattern =
  mongoose.models.Pattern || mongoose.model("Pattern", PatternSchema);

const userId = process.env.SEED_USER_ID || "seed-user";

const sample = [
  {
    questionNumber: 1,
    questionName: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "HashMap"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    approach: `## Problem Intuition
Find two numbers that add up to a target.

## Algorithm
Use a hash map to store \`value -> index\`. For each number, check if \`target - num\` exists.

\`\`\`python
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
\`\`\`

## Complexity
- Time: O(n)
- Space: O(n)

## Notes
The classic one-pass hash map pattern.`
  },
  {
    questionNumber: 15,
    questionName: "3Sum",
    difficulty: "Medium",
    topics: ["Array", "Sliding Window"],
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    approach: `## Problem Intuition
Find all unique triplets summing to zero.

## Algorithm
Sort, then fix one element and use two pointers for the remaining pair. Skip duplicates.

## Complexity
- Time: O(n^2)
- Space: O(1) extra

## Mistakes
Forgetting to skip duplicate values leads to repeated triplets.`
  },
  {
    questionNumber: 76,
    questionName: "Minimum Window Substring",
    difficulty: "Hard",
    topics: ["String", "Sliding Window", "HashMap"],
    leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
    approach: `## Problem Intuition
Smallest window in s containing all chars of t.

## Algorithm
Expand the right pointer to satisfy the constraint, then contract the left pointer to minimise.

## Complexity
- Time: O(|s| + |t|)
- Space: O(|t|)`
  },
  {
    questionNumber: 121,
    questionName: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Array", "DP", "Greedy"],
    leetcodeUrl:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    approach: `## Problem Intuition
Maximise profit from a single buy/sell.

## Algorithm
Track the minimum price so far and the best profit seen.

## Complexity
- Time: O(n)
- Space: O(1)`
  },
  {
    questionNumber: 139,
    questionName: "Word Break",
    difficulty: "Medium",
    topics: ["DP", "String", "Trie"],
    leetcodeUrl: "https://leetcode.com/problems/word-break/",
    approach: `## Problem Intuition
Can the string be segmented into dictionary words?

## Algorithm
DP where \`dp[i]\` is true if \`s[:i]\` is segmentable.

## Complexity
- Time: O(n^2)
- Space: O(n)`
  },
  {
    questionNumber: 200,
    questionName: "Number of Islands",
    difficulty: "Medium",
    topics: ["Graph", "Union Find"],
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    approach: `## Problem Intuition
Count connected components of land.

## Algorithm
DFS/BFS flood fill from each unvisited land cell.

## Complexity
- Time: O(m * n)
- Space: O(m * n)`
  },
  {
    questionNumber: 215,
    questionName: "Kth Largest Element in an Array",
    difficulty: "Medium",
    topics: ["Heap", "Sorting"],
    leetcodeUrl:
      "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    approach: `## Problem Intuition
Find the Kth largest element.

## Algorithm
Maintain a min-heap of size K; the root is the answer.

## Complexity
- Time: O(n log K)
- Space: O(K)`
  },
  {
    questionNumber: 347,
    questionName: "Top K Frequent Elements",
    difficulty: "Medium",
    topics: ["Heap", "HashMap"],
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    approach: `## Problem Intuition
Return the K most frequent elements.

## Algorithm
Count frequencies, then keep a min-heap of size K by frequency.

## Complexity
- Time: O(n log K)
- Space: O(n)`
  }
];

/** Topic → pattern-name links used to auto-associate seed questions. */
const TOPIC_TO_PATTERN: Record<string, string> = {
  Heap: "Heap",
  "Sliding Window": "Sliding Window"
};

const samplePatterns = [
  {
    name: "Heap",
    description: "Useful when solving Kth element and Top-K problems.",
    tags: ["Heap", "Priority Queue", "Top K"],
    triggerKeywords: [
      "Kth",
      "Top K",
      "Largest",
      "Smallest",
      "Closest",
      "Median",
      "Merge K",
      "Running",
      "Stream",
      "Priority"
    ],
    notes: `## When should I think about Heap?
If the problem mentions:

- Kth largest / smallest
- Top K frequent
- Merge K sorted lists
- Running median
- Continuously finding min/max
- Closest K elements

A heap is often one of the best approaches.

## Quick Decision Rules

| Problem | Approach |
| --- | --- |
| Kth Largest | Min Heap of size K |
| Kth Smallest | Max Heap of size K |
| Top K Frequent | Min Heap + Frequency Map |
| Merge K Sorted Lists | Min Heap |
| Running Median | Two Heaps |
| K Closest Elements | Max Heap of size K |`,
    template: `\`\`\`java
PriorityQueue<int[]> pq =
    new PriorityQueue<>((a, b) -> a[1] - b[1]); // min-heap by freq
for (int[] e : entries) {
    pq.offer(e);
    if (pq.size() > k) pq.poll();
}
\`\`\`

\`\`\`python
import heapq
heap = []
for val, freq in entries:
    heapq.heappush(heap, (freq, val))
    if len(heap) > k:
        heapq.heappop(heap)
\`\`\`

\`\`\`cpp
priority_queue<pair<int,int>,
    vector<pair<int,int>>, greater<>> pq;
for (auto& e : entries) {
    pq.push(e);
    if (pq.size() > k) pq.pop();
}
\`\`\``,
    mentalChecklist: [
      "Is K much smaller than N?",
      "Do I only need the Top K elements?",
      "Can I avoid sorting everything?",
      "Is maintaining K elements enough?",
      "Does a streaming solution exist?",
      "Can I process elements one-by-one?"
    ],
    complexities: [
      { operation: "Insert", complexity: "O(log n)" },
      { operation: "Delete", complexity: "O(log n)" },
      { operation: "Peek", complexity: "O(1)" },
      { operation: "Build Heap", complexity: "O(n)" }
    ]
  },
  {
    name: "Sliding Window",
    description: "Contiguous subarray / substring problems with a moving range.",
    tags: ["Sliding Window", "Two Pointers", "String"],
    triggerKeywords: [
      "Subarray",
      "Substring",
      "Contiguous",
      "At most K",
      "Longest",
      "Shortest",
      "Window"
    ],
    notes: `## When to use
- Longest / shortest substring with a constraint
- Max / min sum of a fixed-size window
- "At most K" / "exactly K" counting`,
    template: `\`\`\`python
left = 0
for right in range(len(s)):
    # expand with s[right]
    while invalid():
        # shrink from left
        left += 1
    # update answer
\`\`\``,
    mentalChecklist: [
      "Is the structure contiguous?",
      "Does expanding/shrinking a window preserve validity?",
      "Can I track the window state in O(1)?"
    ],
    complexities: [
      { operation: "Expand", complexity: "O(1) amortised" },
      { operation: "Total", complexity: "O(n)" }
    ]
  }
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Patterns first, so questions can reference their ids.
  let patternsInserted = 0;
  for (const p of samplePatterns) {
    await Pattern.updateOne(
      { createdBy: userId, name: p.name },
      { $set: { ...p, createdBy: userId } },
      { upsert: true }
    );
    patternsInserted += 1;
  }
  console.log(`Seeded ${patternsInserted} patterns for user "${userId}".`);

  // Build a name → id map for auto-linking.
  const patternDocs = (await Pattern.find({ createdBy: userId })
    .select("name")
    .lean()) as unknown as { _id: unknown; name: string }[];
  const patternIdByName = new Map(
    patternDocs.map((p) => [p.name, p._id] as [string, unknown])
  );

  let inserted = 0;
  for (const q of sample) {
    const patternIds = q.topics
      .map((t) => TOPIC_TO_PATTERN[t])
      .filter(Boolean)
      .map((name) => patternIdByName.get(name))
      .filter(Boolean);

    await Question.updateOne(
      { createdBy: userId, questionNumber: q.questionNumber },
      { $set: { ...q, patterns: patternIds, createdBy: userId } },
      { upsert: true }
    );
    inserted += 1;
  }
  console.log(`Seeded ${inserted} questions for user "${userId}".`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
