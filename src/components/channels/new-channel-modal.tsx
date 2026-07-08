"use client";

import { Instagram, MessageCircle, Send, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/modals/modal";

const channelOptions = [
  ["Telegram", "Grátis", Send],
  ["WhatsApp Meta", "Grátis", MessageCircle],
  ["WhatsApp Web", "R$ 97,00", Smartphone],
  ["Instagram", "Grátis", Instagram],
  ["Messenger", "Grátis", MessageCircle],
  ["Mercado Livre", "Grátis", MessageCircle],
  ["Web Chat", "Grátis", MessageCircle],
  ["SMS", "Grátis", Smartphone],
  ["TikTok", "Grátis", MessageCircle]
] as const;

export function NewChannelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCreateChannel(name: string, price: string) {
    setLoadingChannel(name);
    setError("");

    const response = await fetch("/api/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type: name,
        department: "Geral"
      })
    });

    setLoadingChannel(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? `Não foi possível ${price === "Grátis" ? "conectar" : "contratar"} o canal.`);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title="Qual canal deseja conectar?">
      {error ? <p className="mb-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channelOptions.map(([name, price, Icon]) => (
          <Card key={name} className="p-4">
            <Icon className="h-6 w-6 text-primary" />
            <p className="mt-3 font-semibold text-white">{name}</p>
            <p className="mt-1 text-sm text-slate-400">Conecte este canal ao atendimento inteligente.</p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">{price}</span>
              <Button onClick={() => handleCreateChannel(name, price)} disabled={loadingChannel === name}>
                {loadingChannel === name ? "Salvando..." : price === "Grátis" ? "Conectar Grátis" : "Contratar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
