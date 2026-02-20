import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";


const getAllClasses = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/class", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

// React Query hook
export const useGetAllClasses = ({ page = 1, size = 10, search = "", enable }) => {
    return useQuery({
        queryKey: ["classes", page, size, search],
        queryFn: () => getAllClasses({ page, size, search }),
        keepPreviousData: true,
        retry: false,
        enabled: enable
    });
};



// API call to create a new education Class
const createClass = async ({
    name,
}) => {
    const response = await axiosInstance.post("/class", {
        name,
    });

    return response.data;
};

// React Query hook (mutation)
export const useCreateClass = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createClass,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};




// API call to fully update an education Class
const updateClass = async ({
    id,
    name,
}) => {
    const response = await axiosInstance.put(`/class/${id}`, {
        name,
    });

    return response.data;
};

// React Query hook (mutation)
export const useUpdateClass = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateClass,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};