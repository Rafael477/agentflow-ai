import { contacts } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export function ConversationList() {
  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <button key={contact.id} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-sm font-bold text-accent">{contact.name.slice(0, 2).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{contact.name}</p>
              <p className="truncate text-xs text-slate-400">{index === 0 ? "Oi boa noite" : "Gostaria de um orçamento"}</p>
            </div>
            <Badge>{contact.status}</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}
