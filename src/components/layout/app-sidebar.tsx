"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, Bot, ChevronDown, LayoutGrid, MessageSquareText, MoreHorizontal, RadioTower, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const groups = [
  { label: "Visão Geral", items: [{ href: "/dashboard", label: "Dashboards", icon: BarChart3 }] },
  {
    label: "Cadastros",
    items: [
      { href: "/agents", label: "Agentes", icon: Bot },
      { href: "/team", label: "Equipe", icon: UsersRound },
      { href: "/channels", label: "Canais", icon: RadioTower }
    ]
  },
  {
    label: "Comunicação",
    items: [
      { href: "/chat", label: "Chat", icon: MessageSquareText },
      { href: "/contacts", label: "Contatos", icon: LayoutGrid }
    ]
  },
  { label: "Central", items: [{ href: "/more", label: "Mais opções", icon: MoreHorizontal }] }
];

export function AppSidebar() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  async function copyReferral() {
    await navigator.clipboard.writeText("https://files-mentioned-by-the-user-perfeit.vercel.app/register?ref=rafael");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-card p-4 lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-black text-slate-950">AF</div>
        <div>
          <p className="text-sm text-slate-400">Meu Workspace</p>
          <p className="font-semibold text-white">AgentFlow AI</p>
        </div>
        <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
      </div>

      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white",
                      active && "bg-primary/15 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-accent/25 bg-accent/10 p-4">
        <div className="mb-3 flex -space-x-2">
          {["RA", "JH", "CS"].map((avatar) => (
            <span key={avatar} className="grid h-8 w-8 place-items-center rounded-full border border-card bg-panel text-[10px] font-bold">
              {avatar}
            </span>
          ))}
        </div>
        <p className="font-semibold text-white">Indique e Ganhe</p>
        <p className="mt-1 text-xs text-slate-400">Indique seus amigos e ganhe créditos toda vez que um deles se tornar cliente.</p>
        <Button className="mt-3 w-full" onClick={copyReferral}>{copied ? "Link copiado" : "Indicar amigo"}</Button>
      </div>
    </aside>
  );
}
