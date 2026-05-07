import { Link } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function AppSidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/events" className="gap-3">
            <img
              src="/calendar.svg"
              alt="Calendar Icon"
              className="ml-1 size-5 shrink-0"
            />
            <span className="text-base font-semibold">Events App</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
