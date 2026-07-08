import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { AgentForm } from "@/components/forms/agent-form";

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Criar agente" subtitle="Configure o perfil inicial do seu novo agente de IA" />
      <Card className="max-w-3xl">
        <AgentForm />
      </Card>
    </div>
  );
}
