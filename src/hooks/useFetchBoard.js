import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// API call to get all boards
const getAllBoards = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/board", {
        params: {
            page,
            size,
            search
        },
    });

    return response.data;
};

// React Query hook
export const useGetAllBoards = ({ page = 1, size = 10, search = "" }) => {
    return useQuery({
        queryKey: ["boards", page, size, search],
        queryFn: () => getAllBoards({ page, size, search }),
        keepPreviousData: true,
        retry: false,
    });
};
