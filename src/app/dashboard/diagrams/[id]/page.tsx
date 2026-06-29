"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { diagramService } from "@/services/diagramService";
import type { Diagram } from "@/types/diagram";

// React Flow touches browser APIs — load the editor client-only.
const DiagramEditor = dynamic(
  () =>
    import("@/components/diagrams/DiagramEditor").then((m) => m.DiagramEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

export default function DiagramEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    diagramService
      .get(params.id)
      .then(setDiagram)
      .catch(() => setError(true));
  }, [params?.id]);

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">This diagram could not be loaded.</p>
        <button
          onClick={() => router.push("/dashboard/diagrams")}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to Diagrams
        </button>
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <DiagramEditor diagram={diagram} />;
}
