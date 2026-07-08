import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-400">Seu workspace padrão será criado automaticamente.</p>
        <div className="mt-6 grid gap-3">
          <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Nome" />
          <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="E-mail" />
          <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Senha" type="password" />
          <Link href="/dashboard"><Button className="w-full">Cadastrar</Button></Link>
          <Link className="text-center text-sm text-primary" href="/login">Já tenho conta</Link>
        </div>
      </Card>
    </main>
  );
}
