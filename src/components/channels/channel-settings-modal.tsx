"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";
import { DEFAULT_SLA_THRESHOLDS } from "@/lib/sla";
import type { Channel, SlaThresholds } from "@/types/domain";

const tabs = ["Conversa", "Grupos", "Chat Privado", "Ligações", "Assumir atendimento", "Waiting Message"];

export function ChannelSettingsModal({
  channel,
  open,
  onClose
}: {
  channel: Channel | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [slaThresholds, setSlaThresholds] = useState<SlaThresholds>(DEFAULT_SLA_THRESHOLDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSlaThresholds(channel?.slaThresholds ?? DEFAULT_SLA_THRESHOLDS);
    setError("");
  }, [channel]);

  function updateThreshold(field: keyof SlaThresholds, value: string) {
    setSlaThresholds((current) => ({
      ...current,
      [field]: Number(value)
    }));
  }

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!channel) return;

    if (slaThresholds.warning >= slaThresholds.urgent || slaThresholds.urgent >= slaThresholds.critical) {
      setError("Use uma ordem crescente: Atenção menor que Urgente, e Urgente menor que Crítico.");
      return;
    }

    setLoading(true);
    setError("");

    const response = await fetch(`/api/channels/${channel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slaThresholds })
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar os limites de SLA.");
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={channel ? `${channel.type} • ${channel.name}` : "Configurações do canal"}>
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button key={tab} className={index === 0 ? "rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300"}>
            {tab}
          </button>
        ))}
      </div>
      <form className="grid gap-4" onSubmit={saveSettings}>
        {[
          ["Indicador de Digitação", "Mostra digitando... no WhatsApp", "toggle"],
          ["Leitura Automática", "Marca mensagens como lidas", "toggle"],
          ["Processamento de Áudio", "Responder, Ignorar ou Transcrever", "select"],
          ["Ativação do Agente", "Sempre responder, menção ou palavra-chave", "select"],
          ["Encerramento da Conversa", "Nunca parar, após humano ou inatividade", "select"]
        ].map(([title, description, type]) => (
          <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="font-medium text-white">{title}</p>
              <p className="text-sm text-slate-400">{description}</p>
            </div>
            {type === "toggle" ? <div className="h-6 w-11 rounded-full bg-primary p-1"><div className="ml-auto h-4 w-4 rounded-full bg-slate-950" /></div> : <select className="rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm text-white"><option>Selecionar</option></select>}
          </div>
        ))}
        <label className="block">
          <span className="text-sm text-slate-300">Mensagem de resposta quando chamada for rejeitada</span>
          <textarea className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-panel p-3 text-sm outline-none" defaultValue="Desculpe, mas este canal não aceita chamadas telefônicas, apenas comunicações por meio de texto." />
        </label>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4">
            <p className="font-medium text-white">Limites de SLA</p>
            <p className="text-sm text-slate-400">Configure por canal/departamento quando o atendimento vira atenção, urgente ou crítico.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2 text-sm text-slate-300">
              Atenção após
              <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" min={1} type="number" value={slaThresholds.warning} onChange={(event) => updateThreshold("warning", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Urgente após
              <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" min={2} type="number" value={slaThresholds.urgent} onChange={(event) => updateThreshold("urgent", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Crítico após
              <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" min={3} type="number" value={slaThresholds.critical} onChange={(event) => updateThreshold("critical", event.target.value)} />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">Valores em minutos. Conversas desse canal seguem estes limites automaticamente no chat.</p>
        </div>
        {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
        <Button className="justify-self-end" disabled={loading || !channel}>{loading ? "Salvando..." : "Aplicar alterações"}</Button>
      </form>
    </Modal>
  );
}
