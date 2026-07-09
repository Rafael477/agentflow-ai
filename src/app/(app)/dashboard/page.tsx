import { Bot, CalendarClock, CreditCard, MessageCircle, UserPlus } from "lucide-react";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { workspace as mockWorkspace } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getDashboardStats() {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return { credits: mockWorkspace.credits, creditUsage: 6, contacts: 48, appointments: 23, conversations: 186 };
    const [creditUsage, contacts, appointments, conversations] = await Promise.all([
      prisma.creditTransaction.aggregate({ where: { workspaceId: workspace.id, type: "usage" }, _sum: { amount: true } }),
      prisma.contact.count({ where: { workspaceId: workspace.id } }),
      prisma.appointment.count({ where: { workspaceId: workspace.id } }),
      prisma.conversation.count({ where: { workspaceId: workspace.id } })
    ]);
    return {
      credits: workspace.credits,
      creditUsage: Math.abs(creditUsage._sum.amount ?? 0),
      contacts,
      appointments,
      conversations
    };
  } catch {
    return { credits: mockWorkspace.credits, creditUsage: 6, contacts: 48, appointments: 23, conversations: 186 };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboards"
        subtitle="Informações em tempo real sobre sua conta e agentes"
        actions={<DashboardActions />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Atendimentos Concluídos" value={String(stats.conversations)} change="+12%" icon={MessageCircle} />
        <StatCard title="Créditos Gastos" value={String(stats.creditUsage)} change="+4%" icon={CreditCard} />
        <StatCard title="Novos Contatos" value={String(stats.contacts)} change="+18%" icon={UserPlus} />
        <StatCard title="Total de Agendamentos" value={String(stats.appointments)} change="-3%" icon={CalendarClock} />
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
                <p className="text-sm text-slate-400">{stats.creditUsage} créditos</p>
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
