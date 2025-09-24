"use client";
import React from "react";
import Button from "@/components/ui/Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title = "Confirm", description, confirmText = "Confirm", cancelText = "Cancel", isLoading, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-[#2a2a2a] bg-[#121212] p-5 shadow-lg">
        <div className="text-lg font-semibold mb-1">{title}</div>
        {description && <div className="text-sm text-[#cfcfcf] mb-4">{description}</div>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={!!isLoading}>{cancelText}</Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={!!isLoading} disabled={!!isLoading}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}


