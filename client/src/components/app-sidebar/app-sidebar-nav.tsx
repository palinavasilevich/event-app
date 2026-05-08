import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  CalendarCheck2Icon,
  PlusIcon,
  Calendar,
  CalendarHeart,
} from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

const navItems = [
  {
    to: ROUTES.NEW_EVENTS,
    label: "Create event",
    icon: PlusIcon,
    isActive: (path: string) => path === ROUTES.NEW_EVENTS,
    className: "mt-3 bg-primary py-3 text-primary-foreground",
  },
  {
    to: ROUTES.EVENTS,
    label: "All events",
    icon: Calendar,
    isActive: (path: string) =>
      path.startsWith(ROUTES.EVENTS) &&
      path !== ROUTES.NEW_EVENTS &&
      !path.startsWith(ROUTES.MY_EVENTS),
  },
  {
    to: ROUTES.MY_EVENTS,
    label: "My events",
    icon: CalendarCheck2Icon,
    isActive: (path: string) => path.startsWith(ROUTES.MY_EVENTS),
  },

  {
    to: ROUTES.FAVORITE_EVENTS,
    label: "Favorite events",
    icon: CalendarHeart,
    isActive: (path: string) => path.startsWith(ROUTES.FAVORITE_EVENTS),
  },
];

export function AppSidebarNav() {
  const { pathname } = useLocation();

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
