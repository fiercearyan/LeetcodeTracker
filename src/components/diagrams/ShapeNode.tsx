"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface ShapeData {
  kind: string;
  label: string;
  accent?: string;
  description?: string;
  fields?: string;
  methods?: string;
  bg?: string;
  border?: string;
  color?: string;
  fontSize?: number;
  radius?: number;
  borderWidth?: number;
  opacity?: number;
  align?: "left" | "center" | "right";
}

const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  background: "var(--accent)",
  border: "2px solid var(--surface)"
};

function Handles() {
  return (
    <>
      <Handle type="source" position={Position.Top} id="t" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="r" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="l" style={handleStyle} />
    </>
  );
}

function lines(text?: string) {
  return (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export const ShapeNode = memo(function ShapeNode({
  data,
  selected
}: NodeProps<ShapeData>) {
  const accent = data.accent ?? "var(--accent)";
  const baseColor = data.color ?? "var(--t1)";
  const fontSize = data.fontSize ?? 14;
  const align = data.align ?? "left";
  const ring = selected
    ? "0 0 0 2px var(--accent)"
    : "0 1px 2px rgba(0,0,0,0.18)";

  const box: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: data.bg ?? "var(--tile)",
    border: `${data.borderWidth ?? 1}px solid ${
      data.border ?? "rgba(var(--ink),0.18)"
    }`,
    borderRadius: data.radius ?? 10,
    color: baseColor,
    fontSize,
    opacity: data.opacity ?? 1,
    boxShadow: ring,
    boxSizing: "border-box"
  };

  // ---- UML class-like ----
  if (["class", "interface", "abstract", "enum", "object"].includes(data.kind)) {
    const stereotype =
      data.kind === "interface"
        ? "«interface»"
        : data.kind === "abstract"
          ? "«abstract»"
          : data.kind === "enum"
            ? "«enum»"
            : null;
    return (
      <div style={{ ...box, overflow: "hidden", borderColor: accent }}>
        <Handles />
        <div
          style={{
            padding: "8px 12px",
            textAlign: "center",
            borderBottom: `1px solid rgba(var(--ink),0.12)`,
            background: "rgba(var(--ink),0.03)"
          }}
        >
          {stereotype && (
            <div style={{ fontSize: 11, color: "var(--t5)" }}>{stereotype}</div>
          )}
          <div
            style={{
              fontWeight: 600,
              fontStyle: data.kind === "abstract" ? "italic" : "normal"
            }}
          >
            {data.label}
          </div>
        </div>
        <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(var(--ink),0.12)", minHeight: 18 }}>
          {lines(data.fields).map((l, i) => (
            <div key={i} style={{ fontSize: 12.5, color: "var(--t2)" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 12px" }}>
          {lines(data.methods).map((l, i) => (
            <div key={i} style={{ fontSize: 12.5, color: "var(--t2)" }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- Database (cylinder) ----
  if (data.kind === "database") {
    return (
      <div
        style={{
          ...box,
          borderRadius: 12,
          borderColor: accent,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 12px 10px"
        }}
      >
        <Handles />
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 6,
            right: 6,
            height: 12,
            borderRadius: "50%",
            border: `1px solid ${accent}`,
            opacity: 0.6
          }}
        />
        <span style={{ fontWeight: 600, textAlign: "center" }}>{data.label}</span>
      </div>
    );
  }

  // ---- Actor ----
  if (data.kind === "actor") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: baseColor,
          opacity: data.opacity ?? 1
        }}
      >
        <Handles />
        <svg width="34" height="46" viewBox="0 0 34 46" fill="none" stroke={accent} strokeWidth="2">
          <circle cx="17" cy="8" r="6" />
          <path d="M17 14v16M5 20h24M17 30l-8 12M17 30l8 12" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 12.5, fontWeight: 500 }}>{data.label}</span>
      </div>
    );
  }

  // ---- Text / Floating text ----
  if (data.kind === "text") {
    return (
      <div style={{ color: baseColor, fontSize, opacity: data.opacity ?? 1, textAlign: align, padding: 4 }}>
        <Handles />
        {data.label}
      </div>
    );
  }

  // ---- Heading ----
  if (data.kind === "heading") {
    return (
      <div style={{ ...box, padding: "14px 18px", textAlign: align }}>
        <Handles />
        <div style={{ fontSize: Math.max(fontSize + 6, 20), fontWeight: 700 }}>
          {data.label}
        </div>
        {data.description && (
          <div style={{ fontSize: 13, color: "var(--t4)", marginTop: 6 }}>
            {data.description}
          </div>
        )}
      </div>
    );
  }

  // ---- Note ----
  if (data.kind === "note") {
    return (
      <div
        style={{
          ...box,
          background: data.bg ?? "rgba(215,167,90,0.14)",
          border: `1px solid ${data.border ?? "rgba(215,167,90,0.4)"}`,
          color: data.color ?? "var(--t1)",
          padding: "12px 14px",
          textAlign: align
        }}
      >
        <Handles />
        {data.label}
      </div>
    );
  }

  // ---- Divider ----
  if (data.kind === "divider") {
    return (
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Handles />
        <div style={{ height: data.borderWidth ?? 2, width: "100%", background: data.border ?? "rgba(var(--ink),0.3)" }} />
      </div>
    );
  }

  // ---- Default box / rounded / generic component ----
  return (
    <div
      style={{
        ...box,
        borderRadius: data.kind === "rounded" ? 999 : data.radius ?? 10,
        display: "flex",
        alignItems: "center",
        justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        gap: 8,
        padding: "12px 16px",
        borderLeft: `3px solid ${accent}`
      }}
    >
      <Handles />
      <span style={{ fontWeight: 500 }}>{data.label}</span>
    </div>
  );
});
