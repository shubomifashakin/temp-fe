"use client";

import { ReactNode, useState } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardNavbar } from "./dashboard-navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 max-w-6xl w-full mx-auto overflow-hidden">
        <DashboardSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="flex-1 p-6 md:p-8 overflow-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
