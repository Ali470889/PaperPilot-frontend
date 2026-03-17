import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";

// 🔹 API function
const createQuestionType = async ({ name }) => {
    const response = await axiosInstance.post("/question-type", {
        name,
    });

    return response.data;
};

export const useCreateQuestionType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createQuestionType,
        retry: false,
        onSuccess: () => {
            // Invalidate the list so it refetches the new data
            queryClient.invalidateQueries({ queryKey: ["question-types"] });
        },
        onError: (error) => {
            console.error("Error creating question type:", error);
        }
    });
};


// 🔹 API function
const fetchQuestionTypes = async ({ page = 1, size = 10, search = "" } = {}) => {
    const response = await axiosInstance.get("/question-type", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};


export const useGetQuestionTypes = (filters) => {
    return useQuery({
        queryKey: ["question-types", filters],
        queryFn: () => fetchQuestionTypes(filters),
        placeholderData: (previousData) => previousData, // Keeps old UI visible while fetching new page
        retry: false,
    });
};

// 🔹 API function
const updateQuestionType = async ({ id, name }) => {
    const response = await axiosInstance.put(`/question-type/${id}`, {
        name,
    });

    return response.data;
}; 

export const useUpdateQuestionType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateQuestionType,
        onSuccess: () => {
            // Refetch the list to show the updated name
            queryClient.invalidateQueries({ queryKey: ["question-types"] });
        },
        onError: (error) => {
            console.error("Update failed:", error?.response?.data || error.message);
        },
    });
};
