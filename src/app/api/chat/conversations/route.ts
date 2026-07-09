import { NextResponse } from "next/server";
import { getWorkspaceConversations } from "@/lib/chat-conversations";
import { getCurrentUserWorkspace } from "@/lib/workspace";

export async function GET() {
  const workspace = await getCurrentUserWorkspace();
  if (!workspace) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const conversations = await getWorkspaceConversations(workspace.id);
  return NextResponse.json({ conversations });
}
