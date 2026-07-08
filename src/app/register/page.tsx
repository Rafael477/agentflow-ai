import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-400">Seu workspace padrão será criado automaticamente.</p>
        <RegisterForm />
        <Link className="mt-3 block text-center text-sm text-primary" href="/login">Já tenho conta</Link>
      </Card>
    </main>
  );
}
