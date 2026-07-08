"use client";

import { useState } from "react";
import { MoreVertical, Plug, Settings, Trash2 } from "lucide-react";
import type { Channel } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChannelSettingsModal } from "@/components/channels/channel-settings-modal";
import { ConnectChannelModal } from "@/components/channels/connect-channel-modal";

export function ChannelTable({ channels }: { channels: Channel[] }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                {["Nome", "Agente", "Identificador", "Departamento", "Status", "Ações"].map((head) => (
                  <th key={head} className="px-5 py-4 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.id} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{channel.name}</p>
                    <p className="text-xs text-slate-500">{channel.type}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{channel.agent}</td>
                  <td className="px-5 py-4 text-slate-400">{channel.identifier}</td>
                  <td className="px-5 py-4 text-slate-400">{channel.department}</td>
                  <td className="px-5 py-4"><Badge className="border-rose-400/30 bg-rose-400/10 text-rose-200">Desconectado</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setConnectOpen(true)}><Plug className="mr-2 h-4 w-4" />Conectar</Button>
                      <Button variant="ghost" onClick={() => setSettingsOpen(true)}><Settings className="mr-2 h-4 w-4" />Configurações</Button>
                      <Button variant="danger"><Trash2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" className="px-3"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ChannelSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ConnectChannelModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </>
  );
}
