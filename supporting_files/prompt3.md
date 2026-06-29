# Add New Module - Design Patterns

Create a new sidebar tab below **Pattern Library** called **Design Patterns**.

The purpose of this module is to act as a personal knowledge base for software design patterns.

It should follow the exact same design language as the rest of the application (dark/light mode, purple theme, responsive cards, modern drawer UI).

---

# Sidebar

Question Tracker

Pattern Library

Design Patterns

Profile Analytics (Coming Soon)

---

# Design Patterns Dashboard

Display all design patterns as responsive cards.

Desktop

- 4 cards per row

Tablet

- 2 cards per row

Mobile

- 1 card per row

Top right

**+ Add Pattern**

Top left

# Design Patterns

Subtitle

> Learn, revise and quickly recall software design patterns with real-world examples.

---

# Search

Search by

- Pattern Name
- Pattern Type
- Description
- Trigger Words
- Use Cases

---

# Filters

Filter by Pattern Type

- Creational
- Structural
- Behavioral

Allow selecting multiple filters.

---

# Sorting

- Alphabetical
- Recently Updated
- Recently Created

---

# Design Pattern Card

Each card should display:

### Pattern Name

Example

Flyweight

### Pattern Type

Small badge

Structural Design Pattern

### Short Description

Example

Helps reduce memory usage by sharing data among multiple objects.

Maximum 2 lines.

### Trigger Words

Display as chips.

Example

Extrinsic

Intrinsic

Robot

Shared State

Memory

If more than 4 tags exist

Display

+2

### Footer

Used for

Updated

Edit

Delete

Hover animation.

Entire card clickable.

---

# Clicking a Card

Open a right-side drawer.

The drawer should support Markdown rendering with syntax highlighting.

Display sections in this order.

---

# Header

Pattern Name

Flyweight

Pattern Type Badge

Structural Design Pattern

Trigger Words

Extrinsic

Intrinsic

Robot

Shared Object

Memory Optimization

---

# Overview

Definition

Render Markdown.

---

# Real-world Use Cases

Examples

- Word Processor
- Game Development
- Shopping Products
- Icons
- Character Rendering

---

# Problem Statement

Why was this pattern introduced?

Example

Creating thousands of identical heavy objects consumes excessive memory and can crash applications.

---

# When to Use

Render as checklist.

Example

✅ Memory is limited

✅ Objects share common state

✅ Object creation is expensive

---

# Core Concepts

Display information cards.

Intrinsic State

Shared between all objects.

Extrinsic State

Provided by the client at runtime.

Flyweight Object

Stores intrinsic state.

Flyweight Factory

Creates and caches flyweight objects.

---

# How It Solves the Problem

Render Markdown.

Include numbered steps.

Example

1. Separate intrinsic and extrinsic state.
2. Store only intrinsic state inside Flyweight.
3. Make Flyweight immutable.
4. Cache Flyweight objects.
5. Pass extrinsic data during method calls.

---

# UML Diagram

Support uploading an image.

Display the uploaded image responsively.

Allow zoom.

---

# Example Code

Support Markdown.

Language tabs

- Java
- Go
- Python
- C++
- JavaScript

Syntax highlighting.

---

# Advantages

Markdown checklist.

Example

✔ Saves memory

✔ Faster object creation

✔ Reuse existing objects

---

# Disadvantages

Markdown checklist.

Example

✘ Increased complexity

✘ Harder debugging

---

# Interview Questions

Store as collapsible accordions.

Examples

Why is Flyweight a Structural Pattern?

Difference between Flyweight and Singleton?

Intrinsic vs Extrinsic State?

Where is Flyweight used in Java?

---

# Related Design Patterns

Display linked cards.

Example

Factory

Prototype

Object Pool

Decorator

Clicking navigates to that pattern.

---

# Notes

Large Markdown editor.

Personal observations.

Mistakes.

Tips.

---

# Add/Edit Pattern

Fields

Pattern Name

Pattern Type

Description

Trigger Words (chip input)

Definition (Markdown)

Problem Statement (Markdown)

Use Cases (Markdown)

When to Use (Markdown checklist)

Core Concepts

Dynamic list

Example

Title

Description

How It Solves the Problem (Markdown)

Advantages

Disadvantages

Interview Questions

Example Code (Markdown)

Related Patterns (multi-select)

UML Diagram Upload

Personal Notes

---

# Database Schema

```ts
DesignPattern {

name: string

type: "Creational" | "Structural" | "Behavioral"

description: string

triggerWords: string[]

definition: string

problemStatement: string

useCases: string

whenToUse: string[]

coreConcepts: [

{

title: string

description: string

}

]

solution: string

advantages: string[]

disadvantages: string[]

interviewQuestions: string[]

exampleCode: string

relatedPatterns: ObjectId[]

umlImage: string

notes: string

createdAt

updatedAt

}
```

---

# REST APIs

POST /design-patterns

GET /design-patterns

GET /design-patterns/:id

PUT /design-patterns/:id

DELETE /design-patterns/:id

---

# Future Enhancements (Design Only)

The architecture should support future additions such as:

- SOLID Principles
- LLD Notes
- HLD Notes
- Java Collections
- JVM Internals
- Multithreading
- Kafka
- Redis
- System Design
- Database Concepts

without requiring major refactoring.

---

# UI Requirements

- Same purple theme as the existing application.
- Same card styling as Pattern Library.
- Same right-side drawer behavior.
- Responsive layout.
- Smooth animations.
- Markdown rendering with syntax highlighting.
- Image preview for UML diagrams.
- Collapsible sections for long content.
- Consistent typography and spacing across the application.

The goal is to make this module feel like a personal software engineering handbook where every design pattern can be revised in under five minutes before an interview while still allowing deep-dive notes when needed.