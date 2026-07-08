import { Bot, CalendarClock, CreditCard, MessageCircle, UserPlus } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboards"
        subtitle="Informações em tempo real sobre sua conta e agentes"
        actions={<><Button>Visão Geral</Button><Button variant="secondary">Atendimento</Button><Button variant="secondary">Filtros</Button></>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Atendimentos Concluídos" value="186" change="+12%" icon={MessageCircle} />
        <StatCard title="Créditos Gastos" value="6" change="+4%" icon={CreditCard} />
        <StatCard title="Novos Contatos" value="48" change="+18%" icon={UserPlus} />
        <StatCard title="Total de Agendamentos" value="23" change="-3%" icon={CalendarClock} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardChart title="Créditos por período" dataKey="creditos" />
          <DashboardChart title="Atendimentos por período" dataKey="atendimentos" />
          <DashboardChart title="Novos contatos por período" dataKey="contatos" />
          <DashboardChart title="Agendamentos por período" dataKey="agendamentos" />
        </div>
        <Card className="h-fit">
          <Bot className="h-7 w-7 text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-white">Gastos por Modelo</h2>
          <div className="mt-5 rounded-xl bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">GPT-5 Mini</p>
                <p className="text-sm text-slate-400">6 créditos</p>
              </div>
              <Badge className="border-primary/30 bg-primary/10 text-primary">100%</Badge>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-primary" /></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
