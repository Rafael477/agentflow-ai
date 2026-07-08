import { Plus } from "lucide-react";
import { ContactTable } from "@/components/contacts/contact-table";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { mapContact } from "@/lib/mappers";
import { contacts as mockContacts } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getContacts() {
  try {
    const workspace = await getCurrentUserWorkspace();
    if (!workspace) return mockContacts;
    const contacts = await prisma.contact.findMany({
      where: { workspaceId: workspace.id },
      include: { tags: true },
      orderBy: { createdAt: "desc" }
    });
    return contacts.map(mapContact);
  } catch {
    return mockContacts;
  }
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-6">
      <PageHeader title="Contatos" subtitle="Listagem dos contatos da sua conta" actions={<Button><Plus className="mr-2 h-4 w-4" />Criar contato</Button>} />
      <ContactTable contacts={contacts} />
    </div>
  );
}
