"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
