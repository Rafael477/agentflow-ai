export const dynamic = "force-dynamic";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const payload = {
        type: "heartbeat",
        message: "SSE preparado para eventos em tempo real do AgentFlow AI",
        createdAt: new Date().toISOString()
      };
      controller.enqueue(encoder.encode(`event: agentflow\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      controller.close();
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
