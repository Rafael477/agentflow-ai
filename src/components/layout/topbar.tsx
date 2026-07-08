import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { workspace as mockWorkspace } from "@/lib/mock-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentUserWorkspace } from "@/lib/workspace";

async function getTopbarData() {
  try {
    const session = await getServerSession(authOptions);
    const workspace = await getCurrentUserWorkspace();
    return {
      credits: workspace?.credits ?? mockWorkspace.credits,
      name: session?.user?.name ?? mockWorkspace.user.name,
      email: session?.user?.email ?? mockWorkspace.user.email
    };
  } catch {
    return {
      credits: mockWorkspace.credits,
      name: mockWorkspace.user.name,
      email: mockWorkspace.user.email
    };
  }
}

export async function Topbar() {
  const data = await getTopbarData();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="px-3 lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-card px-3 py-2 md:flex md:min-w-80">
          <Search className="h-4 w-4 text-slate-500" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Busque agentes por nome" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm text-primary sm:block">{data.credits} créditos</div>
          <Button variant="secondary" className="px-3">
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button variant="secondary" className="relative px-3">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <ProfileMenu name={data.name ?? "Rafael"} email={data.email ?? "rafael@agentflow.local"} />
        </div>
      </div>
    </header>
  );
}
