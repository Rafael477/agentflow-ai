import { TeamClient, type TeamMemberItem } from "@/components/team/team-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getMembers(): Promise<TeamMemberItem[]> {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return [];

  const members = await prisma.teamMember.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" }
  });

  return members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    permission: member.permission,
    status: member.status,
    lastAccess: member.lastAccess?.toISOString() ?? null
  }));
}

export default async function TeamPage() {
  const members = await getMembers();
  return <TeamClient members={members} />;
}
