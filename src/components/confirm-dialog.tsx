"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";

export function ConfirmDialog({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-400">Confirme a ação para continuar.</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="danger" onClick={onClose}>Confirmar</Button>
      </div>
    </Modal>
  );
}
