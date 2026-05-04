import type { UserPublic } from "@/shared/api/types";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOutIcon } from "lucide-react";
import { getUserInitials } from "@/lib/getUserInitials";

type AppSidebarFooterProps = {
  user: UserPublic;
  isSidebarExpanded: boolean;
  onLogout: () => void;
};

export function AppSidebarFooter({
  user,
  isSidebarExpanded,
  onLogout,
}: AppSidebarFooterProps) {
  return (
    <SidebarMenu className="gap-2 px-1">
      {isSidebarExpanded ? (
        <SidebarMenuItem>
          <div className="flex items-center gap-2 rounded-md px-2 py-1">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </SidebarMenuItem>
      ) : null}

      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={onLogout}
          tooltip="Log out of account"
          className="cursor-pointer"
        >
          <LogOutIcon />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
