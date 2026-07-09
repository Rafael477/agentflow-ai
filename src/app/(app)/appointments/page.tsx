import { AppointmentsClient, type AppointmentItem, type SelectOption } from "@/components/appointments/appointments-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getData(): Promise<{ appointments: AppointmentItem[]; contacts: SelectOption[]; agents: SelectOption[] }> {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return { appointments: [], contacts: [], agents: [] };

  const [appointments, contacts, agents] = await Promise.all([
    prisma.appointment.findMany({
      where: { workspaceId: workspace.id },
      include: { contact: { select: { name: true } } },
      orderBy: { date: "asc" }
    }),
    prisma.contact.findMany({ where: { workspaceId: workspace.id }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.agent.findMany({ where: { workspaceId: workspace.id }, select: { id: true, name: true }, orderBy: { name: "asc" } })
  ]);

  return {
    appointments: appointments.map((appointment) => ({
      id: appointment.id,
      contactId: appointment.contactId,
      agentId: appointment.agentId,
      contactName: appointment.contact?.name ?? "Sem contato",
      service: appointment.service,
      date: appointment.date.toISOString(),
      status: appointment.status,
      notes: appointment.notes
    })),
    contacts,
    agents
  };
}

export default async function AppointmentsPage() {
  const data = await getData();
  return <AppointmentsClient {...data} />;
}
