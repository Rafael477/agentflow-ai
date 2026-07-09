import { Badge } from "@/components/ui/badge";
import type { ConversationSummary } from "@/types/domain";

export type SlaLevel = "normal" | "warning" | "urgent" | "critical";

export interface ConversationSla {
  label: string;
  level: SlaLevel;
  minutesWaiting: number;
}

const slaStyles: Record<SlaLevel, string> = {
  normal: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  urgent: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  critical: "border-rose-400/30 bg-rose-400/10 text-rose-200"
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  getSla
}: {
  conversations: ConversationSummary[];
  selectedId?: string;
  onSelect: (id: string) => void;
  getSla: (conversation: ConversationSummary) => ConversationSla;
}) {
  return (
    <div className="space-y-2">
      {conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
          Não há conversas para mostrar.
        </div>
      ) : null}
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className={selectedId === conversation.id ? "w-full rounded-xl border border-primary/40 bg-primary/10 p-3 text-left transition" : "w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"}
          onClick={() => onSelect(conversation.id)}
          type="button"
        >
          {(() => {
            const sla = getSla(conversation);

            return (
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-sm font-bold text-accent">{conversation.contactName.slice(0, 2).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{conversation.contactName}</p>
              <p className="truncate text-xs text-slate-400">{conversation.lastMessage}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className={slaStyles[sla.level]}>{sla.label}</Badge>
                {conversation.assignedTo ? <span className="text-[11px] text-slate-500">Resp. {conversation.assignedTo}</span> : null}
              </div>
            </div>
            <Badge>{conversation.status}</Badge>
          </div>
            );
          })()}
        </button>
      ))}
    </div>
  );
}
