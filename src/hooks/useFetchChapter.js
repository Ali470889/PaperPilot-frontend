import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";



// API call to get all chapters
const getAllChapters = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/chapter", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const useGetAllChapters = ({
    page = 1,
    size = 10,
    search = "",
}) => {
    return useQuery({
        queryKey: ["chapters", page, size, search],
        queryFn: () => getAllChapters({ page, size, search }),
        keepPreviousData: true,
        retry: false,
    });
};


// API call to create a chapter
const createChapter = async ({ name, number, bookId }) => {
    const response = await axiosInstance.post(
        "/chapter",
        {
            name,
            number,
            bookId,
        }
    );

    return response.data;
};


export const useCreateChapter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createChapter,
        onSuccess: () => {
            toast.success("Chapter created successfully");

            // Refetch chapters list
            queryClient.invalidateQueries({ queryKey: ["chapters"] });
        },
    });
};


// API call to fully update a Chapter
const updateChapter = async ({ id, name, number, bookId }) => {
    const response = await axiosInstance.put(`/chapter/${id}`, {
        name,
        number,
        bookId,
    });

    return response.data;
};

export const useUpdateChapter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateChapter,
        retry: false,
        onSuccess: () => {
            // Invalidate chapters so UI refreshes
            queryClient.invalidateQueries({ queryKey: ["chapters"] });
        },
    });
};