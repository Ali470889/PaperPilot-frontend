// permissions.js
export const ROLES = {
    ADMIN: "superAdmin",
    USER: "user",
    FINANCE_ADMIN: "finance_admin",
    STUDENT_ADMIN: "student_admin",
    PRM_ADMIN: "prm_admin",
    CONTENT_ADMIN: "content_admin",
};

export const PERMISSIONS = {
    [ROLES.ADMIN]: [
        "/dashboard",
        "/province",
        "/board",
        "/class",
        "/subject",
        "/chapter",
        "/publisher",
        "/book",
        "/topic",
        "/paper-generate",
        "/paper-generate/select-publisher",
        "/paper-generate/select-publisher/:publisherId/select-class",
        "/paper-generate/select-publisher/:publisherId/select-class/:classId/select-subject",
        "/paper-generate/select-publisher/:publisherId/select-class/:classId/select-subject/:subjectId/select-book",
        "/paper-generate/:bookId/generate",
        "/templatesPage"
    ],

    [ROLES.USER]: [
        "/paper-generate",
        "/paper-generate/select-publisher",
    ],

    // [ROLES.CONTENT_ADMIN]: [
    //     "/course",
    //     "/dashboard",
    //     "/quiz",
    //     "/question",
    //     "/bundle",
    //     "/batch",
    //     "/video",
    //     "/section",
    //     "/reading",
    //     "/advertisement",
    //     "/flashcard",
    // ],
    // [ROLES.FINANCE_ADMIN]: ["/shop-payment", "/installment", "/shop-purchase"],
    // [ROLES.STUDENT_ADMIN]: ["/purchase-track", "/student"],
    // [ROLES.PRM_ADMIN]: ["/prm-dashboard"],
};
