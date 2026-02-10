import {
    BadgeQuestionMark,
    BookOpenText,
    ChartBarStacked,
    Clipboard,
    CreditCard,
    FileText,
    GraduationCap,
    Group,
    Handshake,
    Layers,
    Megaphone,
    MessageCircleQuestionMark,
    NotebookText,
    SendToBack,
    ShieldUser,
    ShoppingCart,
    StickyNote,
    TrainTrack,
    User,
    Video,
    Workflow
} from "lucide-react";

export const ADMIN_PAGES = [
    {
        name: "Course",
        icon: NotebookText,
        route: "/course",
    },
    {
        name: "Quiz",
        icon: MessageCircleQuestionMark,
        route: "/quiz",
    },
    {
        name: "Section",
        icon: Workflow,
        route: "/section",
    },
    {
        name: "Video",
        icon: Video,
        route: "/video",
    },
    {
        name: "Reading",
        icon: StickyNote,
        route: "/reading",
    },
    {
        name: "Question",
        icon: BadgeQuestionMark,
        route: "/question",
    },
    {
        name: "Flashcard",
        icon: Clipboard,
        route: "/flashcard",
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
        name: "Bundle",
        icon: Layers,
        route: "/bundle",
    },
    {
        name: "Batch",
        icon: ShieldUser,
        route: "/batch",
    },
    {
        name: "Topic",
        icon: FileText,
        route: "/topic",
    },
    {
        name: "Advertisement",
        icon: Megaphone,
        route: "/advertisement",
    },
    {
        name: "Shop purchase",
        icon: CreditCard,
        route: "/shop-purchase",
    },
    {
        name: "Installment",
        icon: SendToBack,
        route: "/installment",
    },
    {
        name: "Purchase Track",
        icon: TrainTrack,
        route: "/purchase-track",
    },
    {
        name: "Student",
        icon: User,
        route: "/student",
    },
    {
        name: "Login",
        icon: null,
        route: "/login",
    },
    {
        name: "Dashboard",
        icon: null,
        route: "/dashboard",
    },
    {
        name: "Unauthorized",
        icon: null,
        route: "/unauthorized",
    },
    {
        name: "PRM Dashboard",
        icon: Handshake,
        route: "/prm-dashboard",
    },
    {
        name: "Shop Product",
        icon: ShoppingCart,
        route: "/shop-product",
    },
    {
        name: "Shop plan",
        icon: Group,
        route: "/shop-plan",
    },
    {
        name: "Category",
        icon: ChartBarStacked,
        route: "/category",
    },
];

{/* <ChartBarStacked /> */}

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