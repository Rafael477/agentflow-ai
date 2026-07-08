import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-slate-950"><Bot /></div>
          <h1 className="mt-4 text-2xl font-bold text-white">Entrar no AgentFlow AI</h1>
          <p className="text-sm text-slate-400">Acesse seu workspace e monitore seus agentes.</p>
        </div>
        <div className="grid gap-3">
          <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="E-mail" defaultValue="rafael@agentflow.local" />
          <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Senha" type="password" defaultValue="123456" />
          <Link href="/dashboard"><Button className="w-full">Entrar</Button></Link>
          <Link className="text-center text-sm text-primary" href="/register">Criar uma conta</Link>
        </div>
      </Card>
    </main>
  );
}
