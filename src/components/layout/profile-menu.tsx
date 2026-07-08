"use client";

import { useState } from "react";
import { Bot, ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function ProfileMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-card px-3 py-2 text-left transition hover:bg-white/10"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-slate-950">
          <Bot className="h-4 w-4" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-500">{email}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-white/10 bg-card p-3 shadow-2xl">
          <div className="border-b border-white/10 pb-3">
            <p className="font-semibold text-white">{name}</p>
            <p className="truncate text-xs text-slate-400">{email}</p>
          </div>
          <Button
            className="mt-3 w-full justify-start"
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </div>
      ) : null}
    </div>
  );
}
