
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavProjects({
  projects
}) {
  const location = useLocation();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Content manage</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.route}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive
                    ? "bg-muted"
                    : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {item.icon ? <item.icon /> : <></>}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
