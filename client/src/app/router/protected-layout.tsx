import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";

export function ProtectedLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="px-4 h-12 flex items-center justify-between">
            <SidebarTrigger className="cursor-pointer" />
            <ThemeToggle />
          </header>
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
