import { PageHeader } from "@/components/layout/page-header";
import { MoreOptionsGrid } from "@/components/more-options-grid";

export default function MorePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mais opções" subtitle="Central de recursos avançados do AgentFlow AI" />
      <MoreOptionsGrid />
    </div>
  );
}
