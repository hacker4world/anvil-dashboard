import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useWebSocketNotification } from "@/hooks/useWebSocketNotification";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {

  useWebSocketNotification();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-72 transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
