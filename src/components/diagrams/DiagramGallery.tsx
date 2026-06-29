"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Copy,
  Download,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Workflow
} from "lucide-react";
import { diagramService } from "@/services/diagramService";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TopicChip } from "@/components/ui/TopicChip";
import { timeAgo } from "@/lib/utils";
import type { Diagram } from "@/types/diagram";

export function DiagramGallery() {
  const router = useRouter();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<Diagram | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<Diagram | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setDiagrams(await diagramService.list());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const visible = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return diagrams;
    return diagrams.filter(
      (d) =>
        d.title.toLowerCase().includes(t) ||
        d.description.toLowerCase().includes(t) ||
        d.folder.toLowerCase().includes(t) ||
        d.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  }, [diagrams, search]);

  const createNew = async () => {
    setCreating(true);
    try {
      const d = await diagramService.create({
        title: "Untitled Diagram",
        nodes: [],
        edges: []
      });
      router.push(`/dashboard/diagrams/${d._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
      setCreating(false);
    }
  };

  const duplicate = async (d: Diagram) => {
    try {
      const copy = await diagramService.create({
        title: `${d.title} (copy)`,
        description: d.description,
        tags: d.tags,
        folder: d.folder,
        nodes: d.nodes,
        edges: d.edges
      });
      setDiagrams((prev) => [copy, ...prev]);
      toast.success("Duplicated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
    }
  };

  const exportJson = (d: Diagram) => {
    const blob = new Blob([JSON.stringify(d, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${d.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doRename = async () => {
    if (!renaming || !renameValue.trim()) return;
    try {
      const updated = await diagramService.update(renaming._id, {
        title: renameValue.trim()
      });
      setDiagrams((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );
      setRenaming(null);
      toast.success("Renamed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[42px] leading-none tracking-[0.3px]">
            Diagram Builder
          </h1>
          <p className="mt-3 text-[13.5px]" style={{ color: "var(--t5)" }}>
            Lightweight UML, DSA & system-design diagrams for interviews —
            built, saved and exported in minutes.
          </p>
        </div>
        <button
          onClick={createNew}
          disabled={creating}
          className="inline-flex items-center justify-center gap-2 self-start rounded-[11px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-px hover:brightness-110 disabled:opacity-60 sm:self-auto"
          style={{ boxShadow: "0 6px 20px -8px var(--accent)" }}
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New Diagram
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, tags, description or folder…"
          className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-ring"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card h-44 p-5">
              <div className="skeleton h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Workflow className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold">
            {diagrams.length > 0 ? "No matching diagrams" : "No diagrams yet"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start a new diagram to sketch a UML class diagram, a DSA dry-run or a
            system-design architecture.
          </p>
          {diagrams.length === 0 && (
            <button
              onClick={createNew}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New Diagram
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {visible.map((d) => (
              <motion.div
                key={d._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                whileHover={{ y: -4 }}
                onClick={() => router.push(`/dashboard/diagrams/${d._id}`)}
                className="glass-card group flex cursor-pointer flex-col p-5 transition-shadow hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    background: "rgba(var(--ink),0.03)",
                    border: "1px solid rgba(var(--ink),0.05)"
                  }}
                >
                  {d.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={d.thumbnail}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Workflow className="h-7 w-7 text-muted-foreground/50" />
                  )}
                </div>
                <h3 className="truncate text-[15px] font-semibold">{d.title}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {d.folder && <TopicChip label={d.folder} />}
                  {d.tags.slice(0, 2).map((t) => (
                    <TopicChip key={t} label={t} />
                  ))}
                </div>
                <div
                  className="mt-auto flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(var(--ink),0.06)" }}
                >
                  <span className="text-xs" style={{ color: "var(--t7)" }}>
                    Updated {timeAgo(d.updatedAt)}
                  </span>
                  <div
                    className="flex items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconBtn label="Rename" onClick={() => { setRenaming(d); setRenameValue(d.title); }}>
                      <Pencil className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn label="Duplicate" onClick={() => duplicate(d)}>
                      <Copy className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn label="Export JSON" onClick={() => exportJson(d)}>
                      <Download className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => setDeleting(d)}>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={Boolean(renaming)}
        onClose={() => setRenaming(null)}
        title="Rename diagram"
        size="max-w-md"
      >
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doRename()}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
        />
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => setRenaming(null)}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={doRename}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Save
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete diagram?"
        message={deleting ? `"${deleting.title}" will be permanently removed.` : ""}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleting) return;
          await diagramService.remove(deleting._id);
          setDiagrams((prev) => prev.filter((d) => d._id !== deleting._id));
          toast.success("Deleted");
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

function IconBtn({
  children,
  label,
  danger,
  onClick
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={
        "rounded-lg p-1.5 text-muted-foreground transition-colors " +
        (danger
          ? "hover:bg-rose-500/10 hover:text-rose-500"
          : "hover:bg-accent hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
