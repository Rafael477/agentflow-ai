import type { Message } from "@/types/domain";

export function MessageBubble({ message }: { message: Message }) {
  const agent = message.author === "Agente";
  return (
    <div className={agent ? "flex justify-end" : "flex justify-start"}>
      <div className={agent ? "max-w-[78%] rounded-2xl bg-primary p-3 text-slate-950" : "max-w-[78%] rounded-2xl bg-panel p-3 text-slate-100"}>
        <p className="text-xs font-semibold opacity-80">{message.author}</p>
        <p className="mt-1 text-sm">{message.content}</p>
        <p className="mt-2 text-right text-[10px] opacity-60">{message.time}</p>
      </div>
    </div>
  );
}
