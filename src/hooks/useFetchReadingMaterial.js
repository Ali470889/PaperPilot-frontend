import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

// --- API call function ---
const getAllReadingMaterials = async ({
  id = null,
  name = null,
  page = 1,
  page_size = 10,
}) => {
  const response = await axiosInstance.get("/reading-material/", {
    params: { id, name, page, page_size },
  });
  return response.data;
};

// --- React Query hook ---
export const useGetAllReadingMaterials = ({
  id = null,
  name = null,
  page = 1,
  page_size = 10,
}) => {
  return useQuery({
    queryKey: ["readingMaterials", id, name, page, page_size],
    queryFn: () => getAllReadingMaterials({ id, name, page, page_size }),
    enabled: page > 0,
    retry: false,
  });
};

// --- API call function ---
const createReadingMaterial = async (data) => {
  const response = await axiosInstance.post("/reading-material/", data);
  return response.data;
};
export const useCreateReadingMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReadingMaterial,
    onSuccess: () => {
      // Invalidate cached reading materials list
      queryClient.invalidateQueries({ queryKey: ["readingMaterials"]});
      toast.success("Reading material created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create reading material!";
      toast.error(message);
    },
  });
};


const updateReadingMaterial = async (
  readingMaterialId,
  name,
  description,
  readingMaterialUrl
) => {
  const payload = {
    name,
    description,
    reading_material_url: readingMaterialUrl,
  };

  const response = await axiosInstance.put(
    `/reading-material/${readingMaterialId}`,
    payload
  );
  return response.data;
};
export const useUpdateReadingMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ readingMaterialId, name, description, readingMaterialUrl }) =>
      updateReadingMaterial(readingMaterialId, name, description, readingMaterialUrl),

    onSuccess: () => {
      // Invalidate cache to refresh reading materials list
      queryClient.invalidateQueries({ queryKey: ["readingMaterials"] });
    },

    retry: false,
  });
};