import { Plus } from "lucide-react";
import { ContactTable } from "@/components/contacts/contact-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Contatos" subtitle="Listagem dos contatos da sua conta" actions={<Button><Plus className="mr-2 h-4 w-4" />Criar contato</Button>} />
      <ContactTable />
    </div>
  );
}
