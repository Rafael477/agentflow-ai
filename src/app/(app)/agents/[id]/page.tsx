"use client";

import Link from "next/link";
import { Bot, Calendar, Code2, Database, FileText, Globe, Headphones, MessageCircle, Mic, PlugZap, Settings, TestTube2, Workflow } from "lucide-react";
import { IntentEmptyState } from "@/components/agents/intent-empty-state";
import { TrainingList } from "@/components/agents/training-list";
import { IntegrationCard } from "@/components/integration-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { agentBehavior } from "@/lib/constants";
import { agents } from "@/lib/mock-data";

const menu = ["Perfil", "Trabalho", "Treinamentos", "Intenções", "Integrações", "Servidores MCP", "Canais", "Configurações"];
const integrations = [
  ["ElevenLabs", "Permite que seu agente responda em áudio com voz humanizada.", Mic],
  ["Google Calendar", "Permite que o agente crie eventos, reuniões e agendamentos.", Calendar],
  ["Plug Chat", "Permite transferir conversas para atendimento humano.", Headphones],
  ["E-vendi", "Permite acessar produtos da loja, consultar preços e enviar links.", Database],
  ["Webhook", "Permite enviar eventos para APIs próprias.", Code2],
  ["Zapier", "Conecte automações externas sem código.", PlugZap],
  ["Make", "Crie fluxos visuais para integrações.", Workflow],
  ["N8N", "Permite conectar automações externas por webhook.", Globe]
] as const;

export default function AgentDetailPage() {
  const agent = agents[0];
  return (
    <div className="space-y-6">
      <PageHeader title={agent.name} subtitle="Configure perfil, treinamentos, intenções, integrações e canais do agente" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <div className="grid place-items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-2xl font-black text-slate-950">JH</div>
            <h2 className="mt-4 text-xl font-semibold text-white">{agent.name}</h2>
            <p className="text-sm text-slate-400">{agent.description}</p>
            <Badge className="mt-3">{agent.model}</Badge>
          </div>
          <div className="mt-6 space-y-1">
            {menu.map((item, index) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll("ç", "c").replaceAll("õ", "o")}`} className={index === 0 ? "flex rounded-lg bg-primary/15 px-3 py-2 text-sm font-medium text-primary" : "flex rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"}>
                {item}
              </a>
            ))}
          </div>
          <Button className="mt-6 w-full"><TestTube2 className="mr-2 h-4 w-4" />Teste sua IA</Button>
        </Card>
        <div className="space-y-5">
          <Card id="perfil">
            <h2 className="text-lg font-semibold text-white">Perfil</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm text-slate-300">Nome do agente<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" defaultValue={agent.name} /></label>
              <div>
                <p className="mb-2 text-sm text-slate-300">Comunicação</p>
                <div className="flex flex-wrap gap-2">{["Formal", "Normal", "Descontraída"].map((item) => <Button key={item} variant={item === "Descontraída" ? "primary" : "secondary"}>{item}</Button>)}</div>
              </div>
              <label className="grid gap-2 text-sm text-slate-300">Comportamento do agente<textarea className="min-h-80 rounded-xl border border-white/10 bg-panel p-3 leading-relaxed outline-none" defaultValue={agentBehavior} /></label>
              <div className="flex justify-end gap-2"><Button variant="secondary">Histórico</Button><Button>Salvar</Button></div>
            </div>
          </Card>
          <Card id="trabalho">
            <h2 className="text-lg font-semibold text-white">Trabalho</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">{["Suporte", "Vendas", "Uso pessoal"].map((item) => <div key={item} className={item === "Vendas" ? "rounded-xl border border-primary/40 bg-primary/10 p-4 text-primary" : "rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300"}>{item}</div>)}</div>
              <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Vende produtos para" defaultValue="Clientes interessados em fotografia e gráfica personalizada" />
              <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Site oficial opcional" />
              <textarea className="min-h-40 rounded-xl border border-white/10 bg-panel p-3 outline-none" defaultValue="Atenda clientes da JH Fotografia & Gráfica com simpatia e profissionalismo. Auxilie em vendas e suporte, apresentando serviços de fotografia, ensaios, casamentos, aniversários, eventos corporativos, estúdio, externos e gráfica personalizada." />
            </div>
          </Card>
          <Card id="treinamentos">
            <h2 className="text-lg font-semibold text-white">Treinamentos</h2>
            <div className="mt-4 flex flex-wrap gap-2">{["Texto", "Website", "Vídeo", "Documento", "Base de conhecimento"].map((tab, index) => <Button key={tab} variant={index === 0 ? "primary" : "secondary"}>{tab}</Button>)}</div>
            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Escreva uma afirmação e tecle enter para cadastrar..." />
              <Button variant="secondary"><FileText className="mr-2 h-4 w-4" />Documento</Button>
              <Button variant="secondary"><Bot className="mr-2 h-4 w-4" />Imagem</Button>
            </div>
            <div className="mt-5"><TrainingList /></div>
          </Card>
          <Card id="intencoes"><IntentEmptyState /></Card>
          <div id="integrações" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {integrations.map(([name, description, Icon]) => <IntegrationCard key={name} name={name} description={description} icon={Icon} />)}
          </div>
          <Card id="canais" className="text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-white">Os canais mudaram de lugar!</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">Agora você pode gerenciar todos os seus canais de atendimento em um único lugar, direto do menu principal.</p>
            <div className="my-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-4 text-slate-400">Antes: Dentro de cada agente &gt; Canais</div>
              <div className="rounded-xl bg-primary/10 p-4 text-primary">Agora: Menu Principal &gt; Canais</div>
            </div>
            <Link href="/channels"><Button>Ir para Canais</Button></Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
