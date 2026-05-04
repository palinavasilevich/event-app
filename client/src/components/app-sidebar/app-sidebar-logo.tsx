import { Link } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Calendar1Icon } from "lucide-react";

export function AppSidebarLogo() {
  return (
    <SidebarMenu className="px-1 gap-2">
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link to="/events" className="gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Calendar1Icon />
            </span>
            <span className="font-heading font-semibold">Events App</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
