import { Copy, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Chave de API" subtitle="Gere, revogue e use chaves para integrações próprias" actions={<Button><KeyRound className="mr-2 h-4 w-4" />Gerar chave</Button>} />
      <Card><p className="text-sm text-slate-400">Chave ativa</p><div className="mt-3 flex flex-col gap-2 rounded-xl bg-panel p-4 md:flex-row md:items-center md:justify-between"><code className="text-primary">af_live_mock_123456789</code><Button variant="secondary"><Copy className="mr-2 h-4 w-4" />Copiar</Button></div><pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-300">Authorization: Bearer SUA_CHAVE_API</pre></Card>
    </div>
  );
}
