import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


const getAllStudents = async ({
    batch_id = null,
    course_ids = null,
    full_name = null,
    email = null,
    user_id = null,
    enrolled_from = null,
    enrolled_to = null,
    enrollment_status = null,
    is_freezed = null,
    is_freezed_date_from = null,
    is_freezed_date_to = null,
    purchase_type = null,
    min_installment_count = null,
    max_installment_count = null,
    package_bought = null,
    min_actual_fee = null,
    max_actual_fee = null,
    min_special_discount_ratio = null,
    max_special_discount_ratio = null,
    min_promo_discount_ratio = null,
    max_promo_discount_ratio = null,
    promo_code = null,
    page = 1,
    page_size = 10,
    fetch_without_pagination = false,
}) => {
    const response = await axiosInstance.get("/student-admin/", {
        params: {
            batch_id,
            course_ids,
            full_name,
            email,
            user_id,
            enrolled_from,
            enrolled_to,
            enrollment_status,
            is_freezed,
            is_freezed_date_from,
            is_freezed_date_to,
            purchase_type,
            min_installment_count,
            max_installment_count,
            package_bought,
            min_actual_fee,
            max_actual_fee,
            min_special_discount_ratio,
            max_special_discount_ratio,
            min_promo_discount_ratio,
            max_promo_discount_ratio,
            promo_code,
            page,
            page_size,
            fetch_without_pagination,
        },
    });

    return response.data;
};


export const useGetAllStudents = ({
    batch_id = null,
    course_ids = null,
    full_name = null,
    email = null,
    user_id = null,
    enrolled_from = null,
    enrolled_to = null,
    enrollment_status = null,
    is_freezed = null,
    is_freezed_date_from = null,
    is_freezed_date_to = null,
    purchase_type = null,
    min_installment_count = null,
    max_installment_count = null,
    package_bought = null,
    min_actual_fee = null,
    max_actual_fee = null,
    min_special_discount_ratio = null,
    max_special_discount_ratio = null,
    min_promo_discount_ratio = null,
    max_promo_discount_ratio = null,
    promo_code = null,
    page = 1,
    page_size = 10,
    fetch_without_pagination = false,
}) => {
    return useQuery({
        queryKey: [
            "searchStudents",
            batch_id,
            course_ids,
            full_name,
            email,
            user_id,
            enrolled_from,
            enrolled_to,
            enrollment_status,
            is_freezed,
            is_freezed_date_from,
            is_freezed_date_to,
            purchase_type,
            min_installment_count,
            max_installment_count,
            package_bought,
            min_actual_fee,
            max_actual_fee,
            min_special_discount_ratio,
            max_special_discount_ratio,
            min_promo_discount_ratio,
            max_promo_discount_ratio,
            promo_code,
            page,
            page_size,
            fetch_without_pagination,
        ],
        queryFn: () =>
            getAllStudents({
                batch_id,
                course_ids,
                full_name,
                email,
                user_id,
                enrolled_from,
                enrolled_to,
                enrollment_status,
                is_freezed,
                is_freezed_date_from,
                is_freezed_date_to,
                purchase_type,
                min_installment_count,
                max_installment_count,
                package_bought,
                min_actual_fee,
                max_actual_fee,
                min_special_discount_ratio,
                max_special_discount_ratio,
                min_promo_discount_ratio,
                max_promo_discount_ratio,
                promo_code,
                page,
                page_size,
                fetch_without_pagination,
            }),
        enabled: page > 0,
        retry: false,
    });
};





const getCompleteStudentProfile = async (student_id) => {
    const response = await axiosInstance.get(
        `/profile-student/complete-student-profile/${student_id}`
    );
    return response.data;
};

export const useGetCompleteStudentProfile = (student_id) => {
    return useQuery({
        queryKey: ["completeStudentProfile", student_id],
        queryFn: () => getCompleteStudentProfile(student_id),
        enabled: !!student_id, // only run when ID is provided
        retry: false,
        onError: (error) => {
            toast.error(error.message || "Error fetching complete student profile.");
        },
    });
};


const postStudentsCompleteData = async ({
    user_ids = [],
    province_id = null,
    district_id = null,
    admin_parent_contact_saved = null,
    admin_student_contact_saved = null,
}) => {
    const response = await axiosInstance.post(
        "/student-admin/students-complete-data",
        user_ids,
        {
            params: {
                province_id,
                district_id,
                admin_parent_contact_saved,
                admin_student_contact_saved,
            },
        }
    );
    return response.data;
};

export const usePostStudentsCompleteData = () => {
    return useMutation({
        mutationFn: ({
            user_ids,
            province_id,
            district_id,
            admin_parent_contact_saved,
            admin_student_contact_saved,
        }) =>
            postStudentsCompleteData({
                user_ids,
                province_id,
                district_id,
                admin_parent_contact_saved,
                admin_student_contact_saved,
            }),
        retry: false,
    });
};



// API function
const modifyStudentData = async ({ userId, email, fullName, avatar_id }) => {
    const response = await axiosInstance.patch(
        `/student-admin/students/${userId}/modify-student-data`,
        {
            params: {
                email,
                full_name: fullName,
                avatar_id
            },
        }
    );

    return response.data;
};


export const useModifyStudentData = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, email, fullName, avatar_id }) =>
            modifyStudentData({ userId, email, fullName, avatar_id }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"]});
            toast.success("Student updated successfuly")
        },

        retry: false,
    });
};



// API function
const updateStudentProfile = async (studentId, payload) => {
    const response = await axiosInstance.put(
        `/profile-student/${studentId}`,
        payload
    );
    return response.data;
};

// React Query hook
export const useUpdateStudentProfile = () => {
    return useMutation({
        mutationFn: ({ studentId, payload }) =>
            updateStudentProfile(studentId, payload),
        retry: false,
    });
};






/* ------------------ Update student contact-saving flags ------------------ */
const updateStudentContactSaving = async ({ student_emails, saved }) => {
    const response = await axiosInstance.patch(
        `/student-admin/students/contact-saving`,
        {
            student_emails,
            saved,
        }
    );
    return response.data;

};



export const useUpdateStudentContactSaving = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateStudentContactSaving,
        onSuccess: () => {
            toast.success("Contact-saving flags updated successfully.");
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        onError: (error) => {
            toast.error(error.message || "Error updating contact-saving flags.");
        },
    });
};



// API function
const changeStudentPassword = async (userId, email, newPassword) => {
    const response = await axiosInstance.put(
        `/student-admin/students/${userId}/change-password`,
        {
            params: {
                email,
                new_password: newPassword,
            },
        }
    );

    return response.data;
};

// React Query hook
export const useChangeStudentPassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, email, newPassword }) =>
            changeStudentPassword(userId, email, newPassword),

        onSuccess: () => {
            // Invalidate relevant caches if needed.
            // For example:
            toast.success("Password updated successfully")
            queryClient.invalidateQueries({ queryKey: ["students-list"] });
        },

        retry: false,
    });
};
