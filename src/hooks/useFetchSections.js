import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

// --- API function ---
const getAllSections = async ({
  page = 1,
  size = 10,
  section_id = null,
  section_name = null,
}) => {
 
  const response = await axiosInstance.get("/section", {
    params: {
      page,
      size,
      section_id,
      section_name
    }
  });
  return response.data;
};

// --- React Query hook ---
export const useGetAllSections = ({
  page = 1,
  size = 10,
  section_id = null,
  section_name = null,
}) => {
  return useQuery({
    queryKey: ["sections", page, size, section_id, section_name],
    queryFn: () => getAllSections({ page, size, section_id, section_name }),
    enabled: page > 0,
    retry: false,
  });
};

// --- API call function ---
const createSection = async (data) => {
  const response = await axiosInstance.post("/section", data);
  return response.data;
};
// --- React Query hook ---
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"]});
      toast.success("Section created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create section!";
      toast.error(message);
    },
  });
};

// --- API call function ---
const updateSection = async (sectionId, name) => {
  const payload = { name };
  const response = await axiosInstance.patch(
    `/section/${sectionId}`,
    payload
  );
  return response.data;
};
// --- React Query hook ---
export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, name }) => updateSection(sectionId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"]});
      toast.success("Section updated successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to update section!";
      toast.error(message);
    },

    retry: false,
  });
};
