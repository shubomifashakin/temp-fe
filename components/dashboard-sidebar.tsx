"use client";

import Link from "next/link";

import { Settings, FileText } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { title: "Files", url: "/dashboard", icon: FileText },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-light hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-sidebar border-border font-mono"
        >
          <div className="py-4 px-3 pt-12">
            <SidebarNav onNavigate={() => onOpenChange?.(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-40 font-mono border-r border-border/50 flex flex-col py-4 px-3">
      <SidebarNav />
    </aside>
  );
}
