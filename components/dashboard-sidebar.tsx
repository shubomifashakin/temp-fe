"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Settings, FileText, CreditCard } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { title: "Files", url: "/dashboard", icon: FileText },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathName = usePathname();

  return (
    <nav className="flex flex-col gap-2.5 text-muted-foreground">
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-orange-500 ${pathName === item.url ? "text-orange-500!" : ""}`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardSidebar({
  open,
  onOpenChange,
}: DashboardSidebarProps) {
  return (
    <>
      <aside className="w-40 hidden md:flex font-mono border-r border-border/50 flex-col py-8 px-3">
        <SidebarNav />
      </aside>

      <div className="md:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="left"
            className="w-60 p-0 border-b border-border/50 bg-background/80 backdrop-blur-md font-mono"
          >
            <div className="py-4 px-3 pt-12">
              <SidebarNav onNavigate={() => onOpenChange?.(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
