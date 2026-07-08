"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ChannelTable } from "@/components/channels/channel-table";
import { NewChannelModal } from "@/components/channels/new-channel-modal";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function ChannelsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeader title="Canais" subtitle="Conecte seus canais de atendimento" actions={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Novo canal</Button>} />
      <ChannelTable />
      <NewChannelModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
