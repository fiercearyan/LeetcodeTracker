"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  getRectOfNodes,
  getTransformForBounds,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance
} from "reactflow";
import "reactflow/dist/style.css";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Grid3x3,
  Loader2,
  Redo2,
  Undo2,
  Upload
} from "lucide-react";
import { ShapeNode } from "@/components/diagrams/ShapeNode";
import { PropertiesPanel } from "@/components/diagrams/PropertiesPanel";
import { PALETTE } from "@/components/diagrams/palette";
import { diagramService } from "@/services/diagramService";
import { cn } from "@/lib/utils";
import type { Diagram } from "@/types/diagram";

const EDGE_DEFAULT_COLOR = "#8b7ff0";

type Marker = { type: MarkerType; color: string; width?: number; height?: number };

function decorateEdge(edge: Edge): Edge {
  const data = (edge.data ?? {}) as Record<string, unknown>;
  const kind = String(data.kind ?? "arrow");
  const color = String(data.color ?? EDGE_DEFAULT_COLOR);
  const thickness = Number(data.thickness ?? 2);
  const pathStyle = String(data.pathStyle ?? "curved");

  // Path geometry is independent of the arrow/relationship type.
  const type =
    pathStyle === "straight"
      ? "straight"
      : pathStyle === "step"
        ? "smoothstep"
        : "default";

  const style: React.CSSProperties = { stroke: color, strokeWidth: thickness };
  const open: Marker = { type: MarkerType.Arrow, color, width: 20, height: 20 };
  const closed: Marker = {
    type: MarkerType.ArrowClosed,
    color,
    width: 22,
    height: 22
  };
  let markerEnd: Marker | undefined;
  let markerStart: Marker | undefined;

  switch (kind) {
    case "line":
      break;
    case "dashed":
      style.strokeDasharray = "6 4";
      markerEnd = open;
      break;
    case "dependency":
      style.strokeDasharray = "6 4";
      markerEnd = open;
      break;
    case "bidirectional":
      markerEnd = open;
      markerStart = open;
      break;
    case "inheritance":
      // filled triangle at the target (points to the parent)
      markerEnd = closed;
      break;
    case "composition":
      // filled marker at the source (the "whole")
      markerStart = closed;
      break;
    case "aggregation":
      // open marker at the source
      markerStart = open;
      break;
    case "association":
    case "arrow":
    default:
      markerEnd = open;
  }

  return {
    ...edge,
    type,
    style,
    markerEnd,
    markerStart,
    // Explicit inline label styles so labels survive PNG/SVG export
    // (React Flow's stylesheet rules aren't captured by html-to-image).
    labelStyle: { fill: "#1b1c21", fontWeight: 600, fontSize: 11 },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.96 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 6
  };
}

let idCounter = 1;
const newId = () => `n${Date.now()}_${idCounter++}`;

interface EditorProps {
  diagram: Diagram;
}

function Inner({ diagram }: EditorProps) {
  const router = useRouter();
  const rf = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    (diagram.nodes as unknown as Node[]) ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    ((diagram.edges as unknown as Edge[]) ?? []).map(decorateEdge)
  );

  const [title, setTitle] = useState(diagram.title);
  const [folder, setFolder] = useState(diagram.folder);
  const [snap, setSnap] = useState(true);
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [exportOpen, setExportOpen] = useState(false);

  const [selNode, setSelNode] = useState<Node | null>(null);
  const [selEdge, setSelEdge] = useState<Edge | null>(null);

  const nodeTypes = useMemo(() => ({ shape: ShapeNode }), []);
  const fileRef = useRef<HTMLInputElement>(null);

  // ---- history (undo/redo) ----
  const past = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const future = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const snapshot = useCallback(() => {
    past.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    });
    if (past.current.length > 60) past.current.shift();
    future.current = [];
  }, [nodes, edges]);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push({ nodes, edges });
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push({ nodes, edges });
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [nodes, edges, setNodes, setEdges]);

  // ---- autosave (debounced, non-blocking) ----
  const loaded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await diagramService.update(diagram._id, {
          title,
          folder,
          nodes: nodes as unknown as Diagram["nodes"],
          edges: edges as unknown as Diagram["edges"]
        });
        setStatus("saved");
      } catch {
        setStatus("unsaved");
      }
    }, 1200);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, title, folder]);

  // ---- connect ----
  const onConnect = useCallback(
    (c: Connection) => {
      snapshot();
      setEdges((eds) =>
        addEdge(
          decorateEdge({
            ...c,
            id: newId(),
            data: { kind: "arrow", color: EDGE_DEFAULT_COLOR, thickness: 2 }
          } as Edge),
          eds
        )
      );
    },
    [setEdges, snapshot]
  );

  // ---- drag & drop from palette ----
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/diagram");
      if (!raw) return;
      const item = JSON.parse(raw) as {
        kind: string;
        label: string;
        accent: string;
      };
      const position = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      snapshot();
      const node: Node = {
        id: newId(),
        type: "shape",
        position,
        data: {
          kind: item.kind,
          label: item.label,
          accent: item.accent,
          ...(["class", "interface", "abstract"].includes(item.kind)
            ? { fields: "+ field: Type", methods: "+ method(): void" }
            : {})
        },
        style: ["class", "interface", "abstract", "enum", "object"].includes(
          item.kind
        )
          ? { width: 200 }
          : undefined
      };
      setNodes((nds) => nds.concat(node));
    },
    [rf, setNodes, snapshot]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // ---- patches ----
  const patchNodeData = useCallback(
    (id: string, data: Record<string, unknown>) =>
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n
        )
      ),
    [setNodes]
  );
  const patchNodeStyle = useCallback(
    (id: string, style: Record<string, unknown>) =>
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, style: { ...n.style, ...style } } : n
        )
      ),
    [setNodes]
  );
  const patchEdge = useCallback(
    (id: string, patch: Record<string, unknown>) =>
      setEdges((eds) =>
        eds.map((e) => (e.id === id ? decorateEdge({ ...e, ...patch }) : e))
      ),
    [setEdges]
  );

  // keep selection objects fresh
  const liveNode = selNode ? nodes.find((n) => n.id === selNode.id) ?? null : null;
  const liveEdge = selEdge ? edges.find((e) => e.id === selEdge.id) ?? null : null;

  const duplicateSel = useCallback(() => {
    if (!liveNode) return;
    snapshot();
    const copy: Node = {
      ...liveNode,
      id: newId(),
      position: { x: liveNode.position.x + 30, y: liveNode.position.y + 30 },
      selected: false
    };
    setNodes((nds) => nds.concat(copy));
  }, [liveNode, setNodes, snapshot]);

  const deleteSel = useCallback(() => {
    snapshot();
    if (liveNode) {
      setNodes((nds) => nds.filter((n) => n.id !== liveNode.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== liveNode.id && e.target !== liveNode.id)
      );
      setSelNode(null);
    } else if (liveEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== liveEdge.id));
      setSelEdge(null);
    }
  }, [liveNode, liveEdge, setNodes, setEdges, snapshot]);

  // ---- auto layout ----
  const autoLayout = useCallback(
    (mode: "horizontal" | "vertical" | "grid") => {
      snapshot();
      setNodes((nds) =>
        nds.map((n, i) => {
          let x = n.position.x;
          let y = n.position.y;
          if (mode === "horizontal") {
            x = 80 + i * 240;
            y = 160;
          } else if (mode === "vertical") {
            x = 200;
            y = 80 + i * 140;
          } else {
            const cols = Math.ceil(Math.sqrt(nds.length));
            x = 80 + (i % cols) * 240;
            y = 80 + Math.floor(i / cols) * 160;
          }
          return { ...n, position: { x, y } };
        })
      );
      setTimeout(() => rf.fitView({ padding: 0.2, duration: 300 }), 50);
    },
    [setNodes, rf, snapshot]
  );

  // ---- keyboard ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        mod &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, duplicateSel]);

  // ---- export ----
  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ title, folder, nodes, edges }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportPng = async (bg: string, scale: number) => {
    setExportOpen(false);
    const viewport = wrapperRef.current?.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement | null;
    if (!viewport || nodes.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const bounds = getRectOfNodes(nodes);
    const pad = 40;
    const w = Math.max(bounds.width + pad * 2, 200);
    const h = Math.max(bounds.height + pad * 2, 200);
    const t = getTransformForBounds(bounds, w, h, 0.3, 2, pad / 100);
    try {
      const dataUrl = await toPng(viewport, {
        backgroundColor: bg === "transparent" ? undefined : bg,
        width: w,
        height: h,
        pixelRatio: scale,
        style: {
          width: `${w}px`,
          height: `${h}px`,
          transform: `translate(${t[0]}px, ${t[1]}px) scale(${t[2]})`
        }
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
    } catch {
      toast.error("Export failed");
    }
  };

  const importJson = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.nodes)) {
          snapshot();
          setNodes(parsed.nodes);
          setEdges((parsed.edges ?? []).map(decorateEdge));
          if (parsed.title) setTitle(parsed.title);
          toast.success("Imported");
        } else {
          toast.error("Invalid diagram JSON");
        }
      } catch {
        toast.error("Could not parse file");
      }
    };
    reader.readAsText(file);
  };

  const statusText =
    status === "saving"
      ? "Saving…"
      : status === "unsaved"
        ? "Unsaved changes"
        : "Saved";

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => router.push("/dashboard/diagrams")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-display text-xl outline-none hover:border-border focus:border-ring"
        />
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            status === "saved"
              ? "text-emerald-500"
              : status === "saving"
                ? "text-muted-foreground"
                : "text-amber-500"
          )}
        >
          {statusText}
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <ToolBtn onClick={undo} label="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn onClick={redo} label="Redo (Ctrl+Y)">
            <Redo2 className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn
            onClick={() => setSnap((s) => !s)}
            label="Snap to grid"
            active={snap}
          >
            <Grid3x3 className="h-4 w-4" />
          </ToolBtn>
          <select
            onChange={(e) => {
              if (e.target.value) {
                autoLayout(e.target.value as "horizontal" | "vertical" | "grid");
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none"
            title="Auto layout"
          >
            <option value="" disabled>
              Layout
            </option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="grid">Grid</option>
          </select>

          <ToolBtn onClick={() => fileRef.current?.click()} label="Import JSON">
            <Upload className="h-4 w-4" />
          </ToolBtn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => importJson(e.target.files?.[0])}
          />

          <div className="relative">
            <button
              onClick={() => setExportOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setExportOpen(false)}
                />
                <div
                  className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border p-1 shadow-lg"
                  style={{ background: "var(--surface)" }}
                >
                  <MenuItem onClick={() => exportPng("transparent", 2)}>
                    PNG · transparent · 2×
                  </MenuItem>
                  <MenuItem onClick={() => exportPng("#ffffff", 2)}>
                    PNG · white · 2×
                  </MenuItem>
                  <MenuItem onClick={() => exportPng("#0e0f13", 2)}>
                    PNG · dark · 2×
                  </MenuItem>
                  <MenuItem onClick={() => exportPng("#ffffff", 4)}>
                    PNG · white · 4× (HQ)
                  </MenuItem>
                  <MenuItem onClick={exportJson}>JSON (editable)</MenuItem>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3-pane layout */}
      <div className="flex min-h-0 flex-1">
        {/* Palette */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-border py-3 pr-3 md:block">
          {PALETTE.map((cat) => (
            <div key={cat.name} className="mb-4">
              <div
                className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[1.2px]"
                style={{ color: "var(--t6)" }}
              >
                {cat.name}
              </div>
              <div className="flex flex-col gap-1">
                {cat.items.map((item) => (
                  <div
                    key={cat.name + item.label}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData(
                        "application/diagram",
                        JSON.stringify({ ...item, accent: cat.accent })
                      )
                    }
                    className="flex cursor-grab items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-[13px] transition-colors hover:border-border hover:bg-accent active:cursor-grabbing"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: cat.accent }}
                    />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Canvas */}
        <div ref={wrapperRef} className="relative min-w-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onSelectionChange={({ nodes: ns, edges: es }) => {
              setSelNode(ns[0] ?? null);
              setSelEdge(es[0] ?? null);
            }}
            snapToGrid={snap}
            snapGrid={[16, 16]}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Shift"]}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable className="!hidden lg:!block" />
          </ReactFlow>
        </div>

        {/* Properties */}
        <aside className="hidden w-72 shrink-0 border-l border-border lg:block">
          <PropertiesPanel
            node={liveNode}
            edge={liveEdge}
            patchNodeData={patchNodeData}
            patchNodeStyle={patchNodeStyle}
            patchEdge={patchEdge}
            onDuplicate={duplicateSel}
            onDelete={deleteSel}
          />
        </aside>
      </div>
    </div>
  );
}

function ToolBtn({
  children,
  label,
  active,
  onClick
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

function MenuItem({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}

export function DiagramEditor({ diagram }: EditorProps) {
  return (
    <ReactFlowProvider>
      <Inner diagram={diagram} />
    </ReactFlowProvider>
  );
}

export type { ReactFlowInstance };
