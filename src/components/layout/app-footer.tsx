import Link from "next/link";
import { Code2, Github, Heart, MessageCircle, ShieldCheck, Sparkles, Tag } from "lucide-react";
import packageInfo from "../../../package.json";

const footerLinks = [
  {
    href: "https://github.com/Rafael477/agentflow-ai",
    label: "GitHub",
    icon: Github,
    external: true
  },
  {
    href: "/channels",
    label: "WhatsApp comercial",
    icon: MessageCircle
  },
  {
    href: "/privacy",
    label: "Privacidade",
    icon: ShieldCheck
  }
];

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
      <div className="glass-panel grid gap-5 rounded-xl px-5 py-4 text-sm text-slate-400 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-medium text-white">
            <Code2 className="h-4 w-4 text-primary" />
            Desenvolvimento feito por Rafael Aniceto da Silva do Nascimento
          </p>
          <p className="mt-1 text-xs">
            AgentFlow AI, construído com cuidado, automação e visão de produto para operações modernas.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <nav className="flex flex-wrap gap-2 text-xs">
            {footerLinks.map((item) => {
              const Icon = item.icon;
              const className = "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary";

              if (item.external) {
                return (
                  <a key={item.href} className={className} href={item.href} target="_blank" rel="noreferrer">
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                );
              }

              return (
                <Link key={item.href} className={className} href={item.href}>
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              SaaS IA
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-accent">
              <Tag className="h-3.5 w-3.5" />
              v{packageInfo.version}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-accent">
              <Heart className="h-3.5 w-3.5" />
              {currentYear}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
