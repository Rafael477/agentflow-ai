import { BillingClient, type BillingTransaction } from "@/components/billing/billing-client";
import { workspace as mockWorkspace } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getBilling(): Promise<{ credits: number; currentPlan?: string | null; transactions: BillingTransaction[] }> {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return { credits: mockWorkspace.credits, currentPlan: "Pro", transactions: [] };

    const [current, transactions] = await Promise.all([
      prisma.workspace.findUnique({
        where: { id: workspace.id },
        include: { billingPlan: { select: { name: true } } }
      }),
      prisma.creditTransaction.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "desc" },
        take: 20
      })
    ]);

    return {
      credits: current?.credits ?? workspace.credits,
      currentPlan: current?.billingPlan?.name,
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        createdAt: transaction.createdAt.toISOString()
      }))
    };
  } catch {
    return { credits: mockWorkspace.credits, currentPlan: "Pro", transactions: [] };
  }
}

export default async function BillingPage() {
  const billing = await getBilling();
  return <BillingClient {...billing} />;
}
