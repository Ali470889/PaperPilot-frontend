import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";


// API call to get all provinces
const getAllProvinces = async ({ page = 1, size = 10, search = null }) => {
    const response = await axiosInstance.get("/province", {
        params: {
            page,
            size,
            search
        },
    });

    return response.data;
};

// React Query hook
export const useGetAllProvinces = ({ page = 1, size = 10, search = null }) => {
    return useQuery({
        queryKey: ["provinces", page, size, search],
        queryFn: () => getAllProvinces({ page, size, search }),
        keepPreviousData: true,
        retry: false,
    });
};


// API call to update a province name
const updateProvince = async ({ id, name }) => {
    const response = await axiosInstance.put(`/province/${id}`,
        { name }
    );
    return response.data;
};

// React Query hook (mutation)
export const useUpdateProvince = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProvince,
        retry: false,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["provinces"] });
        },
    });
};