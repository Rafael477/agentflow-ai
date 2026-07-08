"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modals/modal";

const tabs = ["Conversa", "Grupos", "Chat Privado", "Ligações", "Assumir atendimento", "Waiting Message"];

export function ChannelSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="WhatsApp • Estúdio JH">
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button key={tab} className={index === 0 ? "rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-slate-950" : "rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-300"}>
            {tab}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {[
          ["Indicador de Digitação", "Mostra digitando... no WhatsApp", "toggle"],
          ["Leitura Automática", "Marca mensagens como lidas", "toggle"],
          ["Processamento de Áudio", "Responder, Ignorar ou Transcrever", "select"],
          ["Ativação do Agente", "Sempre responder, menção ou palavra-chave", "select"],
          ["Encerramento da Conversa", "Nunca parar, após humano ou inatividade", "select"]
        ].map(([title, description, type]) => (
          <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="font-medium text-white">{title}</p>
              <p className="text-sm text-slate-400">{description}</p>
            </div>
            {type === "toggle" ? <div className="h-6 w-11 rounded-full bg-primary p-1"><div className="ml-auto h-4 w-4 rounded-full bg-slate-950" /></div> : <select className="rounded-lg border border-white/10 bg-panel px-3 py-2 text-sm text-white"><option>Selecionar</option></select>}
          </div>
        ))}
        <label className="block">
          <span className="text-sm text-slate-300">Mensagem de resposta quando chamada for rejeitada</span>
          <textarea className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-panel p-3 text-sm outline-none" defaultValue="Desculpe, mas este canal não aceita chamadas telefônicas, apenas comunicações por meio de texto." />
        </label>
        <Button className="justify-self-end">Aplicar alterações</Button>
      </div>
    </Modal>
  );
}
