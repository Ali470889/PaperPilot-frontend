import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";



// 🔹 API function
const createBook = async ({ name, subjectId, classId, publisherId }) => {
    const response = await axiosInstance.post("/book", {
        name,
        subjectId,
        classId,
        publisherId,
    });

    return response.data;
};

export const useCreateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBook,
        retry: false,
        onSuccess: () => {
            // invalidate books list so it refetches
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
};

const getAllBooks = async ({ page = 1, size = 10, search = "", publisherId, classId, subjectId }) => {
    const response = await axiosInstance.get("/book", {
        params: {
            page,
            size,
            search,
            publisherId,
            classId,
            subjectId
        },
    });
    return response.data;
};

export const useGetAllBooks = ({
    page = 1,
    size = 10,
    search = "",
    enable = true,
    publisherId,
    classId,
    subjectId
}) => {
    return useQuery({
        queryKey: ["books", page, size, search, publisherId, classId, subjectId],
        queryFn: () => getAllBooks({ page, size, search, publisherId, classId, subjectId }),
        keepPreviousData: true,
        retry: false,
        enabled: enable, // ⚠️ correct key is "enabled", not "enable"
    });
};

// API call to fully update a Book
const updateBook = async ({ id, name, subjectId, classId, publisherId }) => {
    const response = await axiosInstance.put(`/book/${id}`, {
        name,
        subjectId,
        classId,
        publisherId,
    });

    return response.data;
};

// React Query hook for updating a Book
export const useUpdateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateBook,
        retry: false,
        onSuccess: () => {
            // Invalidate queries related to books so UI refreshes
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
};


const getBookById = async (id) => {
    const response = await axiosInstance.get(`/book/${id}`);
    return response.data;
};

export const useGetBookById = (id, enable = true) => {
    return useQuery({
        queryKey: ["book", id],
        queryFn: () => getBookById(id),
        enabled: enable && !!id,
        retry: false,
    });
};