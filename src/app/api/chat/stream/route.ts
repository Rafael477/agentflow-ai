import { createConversationSignature, getWorkspaceConversations } from "@/lib/chat-conversations";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) {
    return new Response("Não autenticado.", { status: 401 });
  }

  const workspaceId = workspace.id;
  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      let previousSignature = "";

      async function publishSnapshot() {
        const conversations = await getWorkspaceConversations(workspaceId);
        const signature = createConversationSignature(conversations);

        if (signature === previousSignature) {
          controller.enqueue(encoder.encode(`event: heartbeat\ndata: ${JSON.stringify({ createdAt: new Date().toISOString() })}\n\n`));
          return;
        }

        previousSignature = signature;
        controller.enqueue(encoder.encode(`event: conversations\ndata: ${JSON.stringify({ conversations })}\n\n`));
      }

      await publishSnapshot();
      interval = setInterval(() => {
        publishSnapshot().catch(() => {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: "Falha ao atualizar conversas." })}\n\n`));
        });
      }, 2500);
    },
    cancel() {
      if (interval) clearInterval(interval);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
