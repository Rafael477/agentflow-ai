import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Dados de conta",
    description: "Usamos dados como nome, e-mail e informações do workspace para autenticação, organização da equipe e funcionamento das áreas internas."
  },
  {
    title: "Dados operacionais",
    description: "Conversas, contatos, agentes, canais, treinamentos e arquivos enviados são usados para entregar as funcionalidades do AgentFlow AI."
  },
  {
    title: "Arquivos e treinamentos",
    description: "Documentos e imagens enviados podem ser processados para extração de conteúdo e armazenados em storage externo quando configurado."
  },
  {
    title: "Segurança",
    description: "Chaves, sessões e dados sensíveis devem ser protegidos por variáveis de ambiente e controles de acesso adequados em produção."
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao sistema
          </Button>
        </Link>

        <section className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm text-primary">
            <ShieldCheck className="h-4 w-4" />
            Política de Privacidade
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Privacidade no AgentFlow AI</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Esta página resume como o projeto trata informações essenciais para autenticação, atendimento, automação e treinamento de agentes de IA.
          </p>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title}>
              <LockKeyhole className="h-5 w-5 text-primary" />
              <h2 className="mt-4 text-lg font-semibold text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{section.description}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-white">Transparência e responsabilidade</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            O desenvolvimento foi feito por Rafael Aniceto da Silva do Nascimento. Em ambientes reais de produção, recomenda-se revisar esta política com base nos fluxos finais, integrações usadas, provedores conectados e requisitos legais aplicáveis.
          </p>
        </Card>
      </div>
    </main>
  );
}
