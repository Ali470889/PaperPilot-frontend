import {
    BadgeQuestionMark,
    BookOpenText,
    FileText,
    GraduationCap,
    LayoutDashboard,
    SquareDashedTopSolid,
    LandPlot,
} from "lucide-react";

export const ADMIN_PAGES = [
    {
        name: "Province",
        icon: LandPlot,
        route: "/province",
    },
    {
        name: "Board",
        icon: SquareDashedTopSolid,
        route: "/board",
    },
    {
        name: "Question",
        icon: BadgeQuestionMark,
        route: "/question",
    },
    {
        name: "Subject",
        icon: GraduationCap,
        route: "/subject",
    },
    {
        name: "Chapter",
        icon: BookOpenText,
        route: "/chapter",
    },
    {
        name: "Topic",
        icon: FileText,
        route: "/topic",
    },
    {
        name: "Login",
        icon: null,
        route: "/login",
    },
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
    },
    {
        name: "Unauthorized",
        icon: null,
        route: "/unauthorized",
    },

];

{/* <ChartBarStacked /> */ }

export const ADMIN_ROUTES = ADMIN_PAGES.reduce((acc, page) => {
    const key = page.name
        .toUpperCase()
        .replace(/\s+/g, "_"); // "Purchase Track" → "PURCHASE_TRACK"

    acc[key] = page.route;
    return acc;
}, {});

export default ADMIN_ROUTES;

export function getPageNameByUrl(route) {
    const page = ADMIN_PAGES.find((item) => item.route === route);
    return page?.name || "Unknown Page";
}