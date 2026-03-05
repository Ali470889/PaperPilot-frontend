import {
    BadgeQuestionMark,
    BookOpenText,
    FileText,
    GraduationCap,
    LayoutDashboard,
    SquareDashedTopSolid,
    LandPlot,
    Shapes,
    BookCheck,
    Book,

} from "lucide-react";

export const ADMIN_PAGES = [
    {
        name: "Province",
        icon: LandPlot,
        route: "/province",
        sidebar: true
    },
    {
        name: "Board",
        icon: SquareDashedTopSolid,
        route: "/board",
        sidebar: true
    },
    {
        name: "Question",
        icon: BadgeQuestionMark,
        route: "/question",
        sidebar: true
    },
    {
        name: "Class",
        icon: Shapes,
        route: "/class",
        sidebar: true
    },
    {
        name: "Subject",
        icon: GraduationCap,
        route: "/subject",
        sidebar: true
    },
    {
        name: "Publisher",
        icon: BookCheck,
        route: "/publisher",
        sidebar: true
    },
    {
        name: "Book",
        icon: Book,
        route: "/book",
        sidebar: true
    },
    {
        name: "Chapter",
        icon: BookOpenText,
        route: "/chapter",
        sidebar: true
    },
    {
        name: "Topic",
        icon: FileText,
        route: "/topic",
        sidebar: true
    },
    {
        name: "Login",
        icon: null,
        route: "/login",
        sidebar: false
    },
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        sidebar: true
    },
    {
        name: "Unauthorized",
        icon: null,
        route: "/unauthorized",
        sidebar: false
    },
    // user routes nested under paper-generate
    {
        name: "Paper Generate",
        icon: null,
        route: "/paper-generate",
        sidebar: false
    },
    {
        name: "Select Publisher",
        icon: null,
        route: "/paper-generate/select-publisher",
        sidebar: false
    },
];


export const ADMIN_ROUTE_BUILDERS = {
    selectPublisherById: (publisherId) => `/paper-generate/select-publisher/${publisherId}`,
};

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

