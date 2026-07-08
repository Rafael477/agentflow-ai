import { ThemeToggle } from "@/components/theme-toggle";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const settings = ["Perfil da conta", "Workspace", "Tema", "Idioma", "Notificações", "Segurança", "Preferências de IA"];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" subtitle="Ajuste conta, segurança, idioma, notificações e modelos de IA" actions={<ThemeToggle />} />
      <div className="grid gap-4 md:grid-cols-2">{settings.map((item) => <Card key={item} className="flex items-center justify-between"><div><h2 className="font-semibold text-white">{item}</h2><p className="text-sm text-slate-400">Configurações de {item.toLowerCase()}.</p></div><Button variant="secondary">Abrir</Button></Card>)}</div>
    </div>
  );
}
