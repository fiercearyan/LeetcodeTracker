# Enhance Pattern Library with Advanced Features

Enhance the existing **Pattern Library** module with the following features while maintaining the current design language, dark/light mode support, and responsive layout.

The new features should integrate seamlessly with the existing Question Tracker module.

---

# 1. Trigger Keywords

Each Pattern should have a dedicated **Trigger Keywords** section.

The purpose of this section is to help users quickly recognize when a particular pattern should come to mind during interviews.

## Database

Add

```ts
triggerKeywords: string[]
```

Example

Heap

```text
Kth
Top K
Largest
Smallest
Closest
Median
Merge K
Running
Stream
Priority
```

---

## Card View

Do not display all trigger keywords on the card.

Instead display

```
10 Trigger Keywords
```

or

```
Top Triggers
Kth • Top K • Median
```

---

## Pattern Details Modal

Display Trigger Keywords immediately below Tags.

Example

```
Trigger Keywords

[Kth]
[Top K]
[Largest]
[Smallest]
[Median]
[Closest]
```

These should be rendered as clickable chips.

Clicking a keyword should search all patterns containing that keyword.

---

## Add/Edit Pattern

Provide a chip input where users can

- Add keyword
- Remove keyword
- Press Enter to create chip
- Paste comma-separated keywords

---

# 2. Related LeetCode Questions

Each Pattern should automatically display all LeetCode questions that use this pattern.

Example

```
Related Questions

215. Kth Largest Element

347. Top K Frequent Elements

23. Merge K Sorted Lists

295. Find Median from Data Stream

973. K Closest Points
```

Each question should show

- Question Number
- Question Name
- Difficulty Badge

Clicking a question should navigate to the Question Tracker and automatically highlight/open that question.

---

## Auto Linking

Do NOT manually maintain these links.

Instead, when creating or editing a Question in the Question Tracker, allow users to associate one or more Patterns.

Example

Question

Top K Frequent Elements

Patterns

✓ Heap

✓ Frequency Map

✓ HashMap

After saving, those Pattern pages should automatically list this question under **Related Questions**.

---

## Database

Question Schema

```ts
patterns: ObjectId[]
```

Pattern Schema

Do NOT store question IDs.

Related questions should be fetched dynamically using the Question collection.

---

# 3. Template Section

Every Pattern should contain an optional reusable coding template.

Purpose

Quick revision before interviews.

---

Database

```ts
template: string
```

Store as Markdown.

---

Display

Create a new section

```
Template
```

Render syntax-highlighted code blocks.

Support multiple languages.

Tabs

Java

Python

Go

JavaScript

C++

If only one language exists, display normally.

---

Example

Heap

```java
PriorityQueue<Pair> pq =
    new PriorityQueue<>((a,b)->a.freq-b.freq);
```

---

# 4. Mental Checklist

Replace the existing **Checklist** section with **Mental Checklist**.

Purpose

Instead of implementation steps, these are questions users should ask themselves before selecting a pattern.

Example

```
Mental Checklist

☐ Is K much smaller than N?

☐ Do I only need Top K elements?

☐ Can I avoid sorting everything?

☐ Is maintaining K elements enough?

☐ Does a streaming solution exist?

☐ Can I process elements one-by-one?
```

Database

```ts
mentalChecklist: string[]
```

Render as a checklist UI.

---

# 5. Complexity Box

Add a compact "Complexity" information card.

Place it on the right side on Desktop.

Move it below the content on Mobile.

---

The box should display

```
Complexities

Insert

O(log n)

Delete

O(log n)

Peek

O(1)

Build Heap

O(n)
```

---

Database

```ts
complexities: {
    operation: string
    complexity: string
}[]
```

---

Display

Small bordered information card.

Professional appearance similar to documentation websites.

---

# 6. Usage Count

Every Pattern card should display how many questions use this pattern.

Example

```
Used in

18 Questions
```

This value should be computed dynamically from the Question collection.

Do not duplicate the count inside Pattern documents.

---

Pattern Detail Page

Display

```
Used In

18 Questions
```

Clicking the count should scroll to the Related Questions section.

---

# 7. Auto-Link Patterns with Question Tracker

Enhance the existing Question Tracker.

---

## Add Question Modal

Add a new field

```
Patterns
```

Multi-select.

Searchable dropdown.

Allow selecting multiple patterns.

Example

```
Patterns

✓ Heap

✓ Binary Search

✓ Two Pointer
```

---

Saving the question should automatically create the relationship.

No manual linking should ever be required.

---

## Question Table

Optionally display

```
Patterns

Heap

HashMap
```

as chips.

---

## Pattern Detail

Automatically populate Related Questions using those relationships.

---

# 8. API Changes

Pattern APIs

```
POST /patterns

GET /patterns

GET /patterns/:id

PUT /patterns/:id

DELETE /patterns/:id
```

Question APIs

Update

```
POST /questions

PUT /questions/:id
```

to support

```ts
patterns: ObjectId[]
```

---

# 9. UI Enhancements

Maintain the current modern design.

Requirements

- Smooth hover animations
- Syntax highlighting for code
- Searchable multi-select
- Responsive layout
- Beautiful chips for Trigger Keywords and Patterns
- Lazy loading for Related Questions if needed
- Consistent spacing and typography with the existing dashboard

---

# Expected User Flow

1. User creates a Pattern called **Heap**.
2. Adds trigger keywords, template, mental checklist, and complexity information.
3. Later, while adding **347. Top K Frequent Elements** in Question Tracker, the user selects **Heap** and **HashMap** under the **Patterns** field.
4. After saving, the **Heap** Pattern automatically shows:
   - **Used in 1 Question**
   - A **Related Questions** section containing **347. Top K Frequent Elements**
5. As more questions are tagged with **Heap**, the usage count and related question list update automatically without any manual maintenance.

The goal is to transform the Pattern Library into a reusable DSA knowledge base that is tightly integrated with the Question Tracker, allowing users to navigate seamlessly between abstract problem-solving patterns and the concrete LeetCode questions that implement them.