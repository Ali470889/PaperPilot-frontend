import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import {
  getTokenFromStorage
} from "../services/tokenStore/storageHelper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ADMIN_PAGES } from "../routes/ADMIN_ROUTES";
import { PERMISSIONS } from '../routes/PERMISSIONS';

export function AppSidebar({ ...props }) {
  const decoded = getTokenFromStorage();
  const userRole = decoded?.role

  const filteredProjects = ADMIN_PAGES.filter((item) => PERMISSIONS[userRole]?.includes(item.route));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <ScrollArea className=" max-h-full min-h-0 rounded-md border">
        <NavProjects projects={filteredProjects} />
      </ScrollArea>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}





