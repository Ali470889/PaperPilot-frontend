import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";


// 🔹 API function
const createSection = async ({ name, section, questionTypeId }) => {
    const response = await axiosInstance.post(
        "/section",
        {
            name,
            section,
            questionTypeId,
        }
    );

    return response.data;
};

/*
    #swagger.tags = ['Sections']
    #swagger.description = 'Update a section'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
     schema: {
                name: "Section A",
                section: {
                     "separation": "",
                      "statement": "solve the following questions",
                      "question": [],
                      "separation2": "",
                      "statement2": "fuck off",
                      "question2": [],
                },
            questionTypeId: 1
     }
    }
*/


export const useCreateSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSection,
        retry: false,
        onSuccess: () => {
            // 🔄 invalidate sections list (adjust key if needed)
            queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
    });
};


// 🔹 API function
const getSections = async ({ page = 1, size = 10, search = "" }) => {
    const response = await axiosInstance.get("/section", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const useGetSections = ({ page, size, search }) => {
    return useQuery({
        queryKey: ["sections", page, size, search],
        queryFn: () => getSections({ page, size, search }),
        keepPreviousData: true, // 🔥 important for pagination UX
        retry: false,
    });
};

// 🔹 API function
const updateSection = async ({ id, name, section, questionTypeId }) => {
    const response = await axiosInstance.put(
        `/section/${id}`,
        {
            name,
            section,
            questionTypeId,
        }
    );

    return response.data;
};

export const useUpdateSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSection,
        retry: false,
        onSuccess: (_, variables) => {
            // 🔄 Invalidate list
            queryClient.invalidateQueries({ queryKey: ["sections"] });

            // 🔄 Optional: update single section cache
            queryClient.invalidateQueries({
                queryKey: ["section", variables.id],
            });
        },
    });
};

// 🔹 API function
const deleteSection = async (id) => {
    const response = await axiosInstance.delete(`/section/${id}`);
    return response.data;
};

export const useDeleteSection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSection,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
    });
};