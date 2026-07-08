import { ContactsClient } from "@/components/contacts/contacts-client";
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

  return <ContactsClient contacts={contacts} />;
}
