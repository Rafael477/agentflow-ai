"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, KeyRound, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface ApiKeyItem {
  id: string;
  name: string;
  maskedKey: string;
  revokedAt: string | Date | null;
  createdAt: string | Date;
}

export function ApiKeysClient({ apiKeys }: { apiKeys: ApiKeyItem[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("Chave principal");
  const [createdKey, setCreatedKey] = useState("");
  const [revoking, setRevoking] = useState<ApiKeyItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  async function createKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Não foi possível gerar a chave.");
      return;
    }

    setCreatedKey(body.key.plainKey);
    router.refresh();
  }

  async function revokeKey() {
    if (!revoking) return;

    setLoading(true);
    const response = await fetch(`/api/api-keys/${revoking.id}`, { method: "DELETE" });
    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível revogar a chave.");
      return;
    }

    setRevoking(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Chave de API" subtitle="Gere, revogue e use chaves para integrações próprias" actions={<Button onClick={() => setCreateOpen(true)}><KeyRound className="mr-2 h-4 w-4" />Gerar chave</Button>} />
      <Card className="space-y-4">
        {apiKeys.length === 0 ? <p className="text-sm text-slate-400">Nenhuma chave criada ainda.</p> : null}
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="flex flex-col gap-3 rounded-xl bg-panel p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">{apiKey.name}</p>
              <code className={apiKey.revokedAt ? "text-slate-500 line-through" : "text-primary"}>{apiKey.maskedKey}</code>
              <p className="mt-1 text-xs text-slate-500">{apiKey.revokedAt ? "Revogada" : "Ativa"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copyText(apiKey.maskedKey)}><Copy className="mr-2 h-4 w-4" />Copiar</Button>
              {!apiKey.revokedAt ? <Button variant="danger" onClick={() => setRevoking(apiKey)}><Trash2 className="h-4 w-4" /></Button> : null}
            </div>
          </div>
        ))}
        <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-300">Authorization: Bearer SUA_CHAVE_API</pre>
      </Card>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setCreatedKey(""); }} title="Gerar chave de API">
        <form className="grid gap-4" onSubmit={createKey}>
          <label className="grid gap-2 text-sm text-slate-300">
            Nome da chave
            <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          {createdKey ? (
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
              <p className="text-sm text-primary">Copie agora. Por segurança, a chave completa não será exibida novamente.</p>
              <code className="mt-3 block break-all text-sm text-white">{createdKey}</code>
              <Button className="mt-3" type="button" variant="secondary" onClick={() => copyText(createdKey)}><Copy className="mr-2 h-4 w-4" />Copiar chave completa</Button>
            </div>
          ) : null}
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Gerando..." : "Gerar chave"}</Button>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(revoking)} onClose={() => setRevoking(null)} title={revoking ? `Revogar ${revoking.name}?` : "Revogar chave?"} onConfirm={revokeKey} loading={loading} />
    </div>
  );
}
