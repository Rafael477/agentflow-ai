import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: LucideIcon }) {
  const positive = !change.startsWith("-");
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className={positive ? "mt-4 text-sm text-primary" : "mt-4 text-sm text-rose-300"}>{change} vs período anterior</p>
    </Card>
  );
}
