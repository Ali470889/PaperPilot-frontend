import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";

const createPublisher = async ({ name }) => {
    const response = await axiosInstance.post("/publisher", { name });
    return response.data;
};

export const useCreatePublisher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPublisher,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
        },
    });
};

const getAllPublishers = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/publisher", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const useGetAllPublishers = ({ page = 1, size = 10, search = "" }) => {
    return useQuery({
        queryKey: ["publishers", page, size, search],
        queryFn: () => getAllPublishers({ page, size, search }),
        keepPreviousData: true, // keeps old data while fetching new
        retry: false,           // prevents automatic retries
    });
};

// API call to fully update a Publisher
const updatePublisher = async ({ id, name }) => {
    const response = await axiosInstance.put(`/publisher/${id}`, {
        name,
    });

    return response.data;
};

export const useUpdatePublisher = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePublisher,
        retry: false,
        onSuccess: () => {
            // Invalidate queries related to publishers so UI refreshes
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
        },
    });
};