"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";

export function ConfirmDialog({ open, onClose, title, onConfirm, loading = false }: { open: boolean; onClose: () => void; title: string; onConfirm?: () => void | Promise<void>; loading?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-400">Confirme a ação para continuar.</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" onClick={() => { void onConfirm?.(); }} disabled={loading}>{loading ? "Confirmando..." : "Confirmar"}</Button>
      </div>
    </Modal>
  );
}
