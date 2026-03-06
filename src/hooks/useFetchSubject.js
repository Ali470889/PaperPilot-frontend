import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";



const getAllSubjects = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/subject", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const useGetAllSubjects = ({ page = 1, size = 10, search = "", enable = true }) => {
    return useQuery({
        queryKey: ["subjects", page, size, search],
        queryFn: () => getAllSubjects({ page, size, search }),
        keepPreviousData: true,
        retry: false,
        enabled: enable
    });
};

const createSubject = async ({ name, description }) => {
    const response = await axiosInstance.post(
        "/subject",
        {
            name,
            description,
        }
    );

    return response.data;
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubject,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
};



// API call to fully update an education Subject
const updateSubject = async ({
    id,
    name,
    description
}) => {
    const response = await axiosInstance.put(`/subject/${id}`, {
        name,
        description
    });

    return response.data;
};

// React Query hook (mutation)
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSubject,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
};



const getFilteredSubjects = async ({
    classId,
    publisherId,
    page = 1,
    size = 10,
    search = "",
}) => {

    const response = await axiosInstance.get("/subject/filter", {
        params: {
            classId,
            publisherId,
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const useGetFilteredSubjects = ({
    classId,
    publisherId,
    page = 1,
    size = 10,
    search = "",
    enable = true
}) => {

    return useQuery({
        queryKey: ["filtered-subjects", classId, publisherId, page, size, search],
        queryFn: () =>
            getFilteredSubjects({
                classId,
                publisherId,
                page,
                size,
                search,
            }),
        keepPreviousData: true,
        retry: false,
        enabled: enable && !!(classId || publisherId),
    });
};