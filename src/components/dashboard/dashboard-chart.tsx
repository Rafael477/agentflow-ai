"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartData } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

export function DashboardChart({ title, dataKey }: { title: string; dataKey: "creditos" | "atendimentos" | "contatos" | "agendamentos" }) {
  return (
    <Card className="min-h-80">
      <h2 className="mb-6 font-semibold text-white">{title}</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`${dataKey}Gradient`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: "#202133", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
            <Area type="monotone" dataKey={dataKey} stroke="#14B8A6" fill={`url(#${dataKey}Gradient)`} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
