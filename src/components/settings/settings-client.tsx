"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const settings = ["Perfil da conta", "Workspace", "Tema", "Idioma", "Notificações", "Segurança", "Preferências de IA"];

export function SettingsClient() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState("");

  function saveSetting() {
    if (!selected) return;
    setSaved(`${selected} salvo com sucesso.`);
    window.setTimeout(() => setSaved(""), 2500);
    setSelected(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" subtitle="Ajuste conta, segurança, idioma, notificações e modelos de IA" actions={<ThemeToggle />} />
      {saved ? <p className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">{saved}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">{settings.map((item) => <Card key={item} className="flex items-center justify-between"><div><h2 className="font-semibold text-white">{item}</h2><p className="text-sm text-slate-400">Configurações de {item.toLowerCase()}.</p></div><Button variant="secondary" onClick={() => setSelected(item)}>Abrir</Button></Card>)}</div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ?? "Configuração"}>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Preferência
            <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" defaultValue={selected ?? ""} />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Ativar notificações relacionadas
            <input type="checkbox" defaultChecked />
          </label>
          <Button className="justify-self-end" onClick={saveSetting}>Salvar configuração</Button>
        </div>
      </Modal>
    </div>
  );
}
