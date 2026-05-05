import { useAuthStore } from "@/stores/auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "../ui/sidebar";
import { AppSidebarLogo } from "./app-sidebar-logo";
import { AppSidebarFooter } from "./app-sidebar-footer";
import { AppSidebarNav } from "./app-sidebar-nav";

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { state } = useSidebar();

  if (!user) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <AppSidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter
          user={user}
          isSidebarExpanded={state === "expanded"}
          onLogout={logout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
