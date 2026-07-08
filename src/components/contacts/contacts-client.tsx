"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ContactTable } from "@/components/contacts/contact-table";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/types/domain";
import { useRouter } from "next/navigation";

export function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", channel: "WhatsApp" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      channel: form.channel || undefined
    };

    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível criar o contato.");
      return;
    }

    setOpen(false);
    setForm({ name: "", phone: "", email: "", channel: "WhatsApp" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Contatos" subtitle="Listagem dos contatos da sua conta" actions={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Criar contato</Button>} />
      <ContactTable contacts={contacts} />
      <Modal open={open} onClose={() => setOpen(false)} title="Criar contato">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Telefone<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label>
          <label className="grid gap-2 text-sm text-slate-300">E-mail<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className="grid gap-2 text-sm text-slate-300">Canal<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))}><option>WhatsApp</option><option>Instagram</option><option>Web Chat</option><option>SMS</option></select></label>
          {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
          <Button className="justify-self-end" disabled={loading}>{loading ? "Criando..." : "Salvar contato"}</Button>
        </form>
      </Modal>
    </div>
  );
}
