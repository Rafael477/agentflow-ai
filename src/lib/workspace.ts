import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserWorkspace() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.workspace.findFirst({
    where: {
      OR: [
        { ownerId: userId },
        { teamMembers: { some: { userId } } }
      ]
    },
    orderBy: { createdAt: "asc" }
  });
}
