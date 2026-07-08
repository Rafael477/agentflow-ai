"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("Rafael");
  const [email, setEmail] = useState("rafael@agentflow.local");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Não foi possível criar a conta." }));
      setError(body.error ?? "Não foi possível criar a conta.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
      <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Nome" value={name} onChange={(event) => setName(event.target.value)} />
      <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <Button className="w-full" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</Button>
    </form>
  );
}
