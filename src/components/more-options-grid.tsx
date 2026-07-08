import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { moreOptions } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

export function MoreOptionsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {moreOptions.map((option) => {
        const Icon = option.icon;
        return (
          <Link key={option.href} href={option.href}>
            <Card className="h-full transition hover:-translate-y-1 hover:border-primary/30">
              <Icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-semibold text-white">{option.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{option.description}</p>
              <p className="mt-4 inline-flex items-center text-sm font-medium text-primary">Abrir <ArrowRight className="ml-1 h-4 w-4" /></p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
