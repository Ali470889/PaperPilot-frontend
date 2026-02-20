import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";

// Fetch all topics with pagination/search
const getAllTopics = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/topic", {
        params: { page, size, search },
    });

    return response.data;
};

export const useGetAllTopics = ({
    page = 1,
    size = 10,
    search = "",
    enable = true,
}) => {
    return useQuery({
        queryKey: ["topics", page, size, search],
        queryFn: () => getAllTopics({ page, size, search }),
        keepPreviousData: true,
        retry: false,
        enabled: enable,
    });
};

// create a single topic
const createTopic = async ({ name, number, chapterId }) => {
    const response = await axiosInstance.post("/topic", {
        name,
        number,
        chapterId,
    });

    return response.data;
};

export const useCreateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTopic,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["topics"] });
        },
    });
};

// update an existing topic
const updateTopic = async ({ id, name, number, chapterId }) => {
    const response = await axiosInstance.put(`/topic/${id}`, {
        name,
        number,
        chapterId,
    });

    return response.data;
};

export const useUpdateTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTopic,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["topics"] });
        },
    });
};

// delete a topic by id
const deleteTopic = async (id) => {
    const response = await axiosInstance.delete(`/topic/${id}`);
    return response.data;
};

export const useDeleteTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTopic,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["topics"] });
        },
    });
};
