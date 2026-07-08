"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";

export function ConnectChannelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Para vincular seu WhatsApp, siga as instruções abaixo:">
      <div className="grid gap-6 md:grid-cols-[1fr_220px]">
        <div>
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            Este canal está em período teste!
          </div>
          <ol className="space-y-3 text-sm text-slate-300">
            <li>1. Abra o WhatsApp no seu telefone</li>
            <li>2. Toque no menu ou em configurações e selecione Aparelhos conectados</li>
            <li>3. Toque em Conectar um aparelho</li>
            <li>4. Aponte seu telefone para este QR Code</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button>Assinar Canal</Button>
            <Button variant="secondary">Problemas com chave de acesso?</Button>
            <Button variant="ghost" onClick={onClose}>Fechar</Button>
          </div>
        </div>
        <div className="grid aspect-square place-items-center rounded-2xl bg-white p-4">
          <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
            {Array.from({ length: 25 }, (_, index) => (
              <div key={index} className={(index * 7) % 3 === 0 ? "rounded bg-slate-950" : "rounded bg-slate-200"} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
