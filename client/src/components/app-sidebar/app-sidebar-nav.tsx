import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { PlusIcon, SquaresExclude } from "lucide-react";

export function AppSidebarNav() {
  const { pathname } = useLocation();

  const navItems = [
    {
      to: "/events/new",
      label: "Create event",
      icon: PlusIcon,
      isActive: (path: string) => path === "/events/new",
      className: "min-h-12 bg-primary py-3 text-primary-foreground",
    },
    {
      to: "/events",
      label: "All events",
      icon: SquaresExclude,
      isActive: (path: string) =>
        path.startsWith("/events") &&
        path !== "/events/new" &&
        !path.startsWith("/events/my"),
    },
    {
      to: "/events/my",
      label: "My events",
      icon: SquaresExclude,
      isActive: (path: string) => path.startsWith("/events/my"),
    },
  ];

  return (
    <SidebarMenu className="gap-3 px-1">
      {navItems.map(({ to, label, icon: Icon, isActive, className }) => (
        <SidebarMenuItem key={to}>
          <SidebarMenuButton
            asChild
            isActive={isActive(pathname)}
            tooltip={label}
            className={className}
          >
            <Link to={to}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
