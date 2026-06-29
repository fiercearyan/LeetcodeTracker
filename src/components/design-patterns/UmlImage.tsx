"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";

/** Responsive UML image with click-to-zoom. */
export function UmlImage({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom]);

  if (!src) return null;

  return (
    <>
      <button
        onClick={() => setZoom(true)}
        className="group relative block w-full overflow-hidden rounded-xl border"
        style={{
          borderColor: "rgba(var(--ink),0.08)",
          background: "rgba(var(--ink),0.02)"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[360px] w-full object-contain"
        />
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-3.5 w-3.5" /> Zoom
        </span>
      </button>

      {zoom &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          >
            <button
              onClick={() => setZoom(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>,
          document.body
        )}
    </>
  );
}
