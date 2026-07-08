import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Criar agente" subtitle="Configure o perfil inicial do seu novo agente de IA" />
      <Card className="max-w-3xl">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">Nome do agente<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Ex.: Jéssica Helen" /></label>
          <label className="grid gap-2 text-sm text-slate-300">Descrição<textarea className="min-h-28 rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Descreva a função do agente" /></label>
          <label className="grid gap-2 text-sm text-slate-300">Modelo<select className="rounded-xl border border-white/10 bg-panel p-3 outline-none"><option>GPT-5 Mini</option><option>OpenRouter</option><option>Groq</option><option>Gemini</option></select></label>
          <Button className="justify-self-start">Salvar agente</Button>
        </div>
      </Card>
    </div>
  );
}
