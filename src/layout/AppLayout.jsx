
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useLocation } from "react-router-dom"

import { jwtDecode } from "jwt-decode"
import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/shared/ThemeToggle'
import { getPageNameByUrl } from '../routes/ADMIN_ROUTES'
import { getFromStorage } from "../services/tokenStore/storageHelper"


const AppLayout = () => {

  const { pathname } = useLocation();
  const pageName = getPageNameByUrl(pathname)

  const token = getFromStorage();
  if (!token) return null;
  const decoded = jwtDecode(token?.refreshToken);
  const role = decoded?.role;


  return (
    <>
      <SidebarProvider
        className="overflow-hidden"
      >
        {/* {role !== "user" && <AppSidebar />} */}
        <AppSidebar />
        <SidebarInset className="overflow-hidden" >

          {/* {role == "user" && <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"> */}
          {true && <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink>
                      {pageName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </header>}

          <div className="flex flex-1 flex-col gap-6 p-4 pt-0 overflow-hidden">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default AppLayout

