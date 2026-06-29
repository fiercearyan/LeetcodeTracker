"use client";

import { Copy, Trash2 } from "lucide-react";
import type { Edge, Node } from "reactflow";
import { EDGE_KINDS, EDGE_PATHS } from "@/components/diagrams/palette";

interface Props {
  node: Node | null;
  edge: Edge | null;
  patchNodeData: (id: string, data: Record<string, unknown>) => void;
  patchNodeStyle: (id: string, style: Record<string, unknown>) => void;
  patchEdge: (id: string, patch: Record<string, unknown>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const label = "mb-1 block text-[11px] font-medium uppercase tracking-wide";
const field =
  "w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:border-ring";

export function PropertiesPanel({
  node,
  edge,
  patchNodeData,
  patchNodeStyle,
  patchEdge,
  onDuplicate,
  onDelete
}: Props) {
  if (!node && !edge) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a node or edge to edit its properties.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">
          {node ? "Node" : "Edge"} properties
        </span>
        <div className="flex gap-1">
          {node && (
            <button
              onClick={onDuplicate}
              title="Duplicate"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            title="Delete"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {node && (
          <NodeProps
            node={node}
            patchNodeData={patchNodeData}
            patchNodeStyle={patchNodeStyle}
          />
        )}
        {edge && <EdgeProps edge={edge} patchEdge={patchEdge} />}
      </div>
    </div>
  );
}

function NodeProps({
  node,
  patchNodeData,
  patchNodeStyle
}: {
  node: Node;
  patchNodeData: (id: string, data: Record<string, unknown>) => void;
  patchNodeStyle: (id: string, style: Record<string, unknown>) => void;
}) {
  const d = node.data as Record<string, unknown>;
  const kind = String(d.kind ?? "box");
  const isClass = ["class", "interface", "abstract", "enum", "object"].includes(
    kind
  );
  const set = (k: string, v: unknown) => patchNodeData(node.id, { [k]: v });
  const setStyle = (k: string, v: unknown) =>
    patchNodeStyle(node.id, { [k]: v });
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

  return (
    <>
      <div>
        <label className={label} style={{ color: "var(--t6)" }}>
          {kind === "heading" ? "Heading" : "Label / Title"}
        </label>
        <input
          className={field}
          value={String(d.label ?? "")}
          onChange={(e) => set("label", e.target.value)}
        />
      </div>

      {kind === "heading" && (
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Description
          </label>
          <textarea
            rows={2}
            className={field}
            value={String(d.description ?? "")}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      )}

      {isClass && (
        <>
          <div>
            <label className={label} style={{ color: "var(--t6)" }}>
              Fields (one per line)
            </label>
            <textarea
              rows={3}
              className={field}
              value={String(d.fields ?? "")}
              onChange={(e) => set("fields", e.target.value)}
            />
          </div>
          <div>
            <label className={label} style={{ color: "var(--t6)" }}>
              Methods (one per line)
            </label>
            <textarea
              rows={3}
              className={field}
              value={String(d.methods ?? "")}
              onChange={(e) => set("methods", e.target.value)}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Width
          </label>
          <input
            type="number"
            className={field}
            value={num((node.style as Record<string, unknown>)?.width) || ""}
            placeholder="auto"
            onChange={(e) =>
              setStyle("width", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Height
          </label>
          <input
            type="number"
            className={field}
            value={num((node.style as Record<string, unknown>)?.height) || ""}
            placeholder="auto"
            onChange={(e) =>
              setStyle("height", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ColorField label="Fill" value={d.bg} onChange={(v) => set("bg", v)} />
        <ColorField label="Border" value={d.border} onChange={(v) => set("border", v)} />
        <ColorField label="Text" value={d.color} onChange={(v) => set("color", v)} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Font size
          </label>
          <input
            type="number"
            className={field}
            value={num(d.fontSize) || 14}
            onChange={(e) => set("fontSize", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Radius
          </label>
          <input
            type="number"
            className={field}
            value={num(d.radius)}
            onChange={(e) => set("radius", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Border width
          </label>
          <input
            type="number"
            className={field}
            value={num(d.borderWidth) || 1}
            onChange={(e) => set("borderWidth", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Opacity
          </label>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            className="w-full"
            value={typeof d.opacity === "number" ? d.opacity : 1}
            onChange={(e) => set("opacity", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className={label} style={{ color: "var(--t6)" }}>
          Align
        </label>
        <select
          className={field}
          value={String(d.align ?? "left")}
          onChange={(e) => set("align", e.target.value)}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </>
  );
}

function EdgeProps({
  edge,
  patchEdge
}: {
  edge: Edge;
  patchEdge: (id: string, patch: Record<string, unknown>) => void;
}) {
  const d = (edge.data ?? {}) as Record<string, unknown>;
  const set = (patch: Record<string, unknown>) => patchEdge(edge.id, patch);

  return (
    <>
      <div>
        <label className={label} style={{ color: "var(--t6)" }}>
          Arrow type
        </label>
        <select
          className={field}
          value={String(d.kind ?? "arrow")}
          onChange={(e) => set({ data: { ...d, kind: e.target.value } })}
        >
          {EDGE_KINDS.map((k) => (
            <option key={k.kind} value={k.kind}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} style={{ color: "var(--t6)" }}>
          Path
        </label>
        <select
          className={field}
          value={String(d.pathStyle ?? "curved")}
          onChange={(e) => set({ data: { ...d, pathStyle: e.target.value } })}
        >
          {EDGE_PATHS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} style={{ color: "var(--t6)" }}>
          Label
        </label>
        <input
          className={field}
          value={String(edge.label ?? "")}
          onChange={(e) => set({ label: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ColorField
          label="Color"
          value={(edge.style as Record<string, unknown>)?.stroke}
          onChange={(v) => set({ data: { ...d, color: v } })}
        />
        <div>
          <label className={label} style={{ color: "var(--t6)" }}>
            Thickness
          </label>
          <input
            type="number"
            min={1}
            max={8}
            className={field}
            value={Number(d.thickness ?? 2)}
            onChange={(e) =>
              set({ data: { ...d, thickness: Number(e.target.value) } })
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(edge.animated)}
          onChange={(e) => set({ animated: e.target.checked })}
        />
        Animated
      </label>
    </>
  );
}

function ColorField({
  label: lbl,
  value,
  onChange
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
}) {
  const v = typeof value === "string" && value.startsWith("#") ? value : "#8b7ff0";
  return (
    <div>
      <label className={label} style={{ color: "var(--t6)" }}>
        {lbl}
      </label>
      <input
        type="color"
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full cursor-pointer rounded-lg border border-input bg-background"
      />
    </div>
  );
}
