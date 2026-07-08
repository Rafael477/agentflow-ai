"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("rafael@agentflow.local");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <Button className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}
