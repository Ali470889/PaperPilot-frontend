import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/services/api/axiosInstance";

import { toast } from "sonner";

const getAllBatches = async ({
  page = 1,
  size = 10,
  batch_id = null,
  batch_name = null,
}) => {
  const response = await axiosInstance.get("/batch/", {
    params: {
      page,
      size,
      batch_id,
      batch_name,
    },
  });
  return response.data;
};

// React Query hook
export const useGetAllBatches = ({
  page = 1,
  size = 10,
  batch_id = null,
  batch_name = null,
  enabled = true
}) => {
  return useQuery({
    queryKey: ["batches", page, size, batch_id, batch_name],
    queryFn: () => getAllBatches({ page, size, batch_id, batch_name }),
    keepPreviousData: true,
    retry: false,
    enabled: enabled
  });
};

// API function
const updateBatch = async (batchId, name, description, batchImageUrl) => {
  const payload = {
    name,
    description,
    batch_image_url: batchImageUrl,
  };

  const response = await axiosInstance.put(`/batch/${batchId}`, payload);
  return response.data;
};

// React Query hook
export const useUpdateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, name, description, batchImageUrl }) =>
      updateBatch(batchId, name, description, batchImageUrl),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["batches"],
      });
    },
  });
};

// --- API call ---
const createBatch = async (data) => {
  const response = await axiosInstance.post("/batch/", data);
  return response.data;
};

// --- React Query hook ---
export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      // Invalidate cached batch list to refresh data
      queryClient.invalidateQueries({queryKey: ["batches"] });
      toast.success("Batch created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create batch!";
      toast.error(message);
    },
  });
};

// Add Course in batch

// Function to fetch courses by batch ID
const getCoursesByBatch = async (batch_id) => {
  const response = await axiosInstance.get(`/batch/${batch_id}/courses`);
  return response.data;
};

// React Query hook
export const useGetCoursesByBatch = (batch_id) => {
  return useQuery({
    queryKey: ["courses", batch_id],
    queryFn: () => getCoursesByBatch(batch_id),
    enabled: !!batch_id, // run only if batchId is defined
    retry: false,
  });
};

const updateBatchCourses = async (batchId, action, courseIds) => {
  const payload = { course_ids: courseIds };
  const response = await axiosInstance.post(
    `/batch/${batchId}/courses?action=${action}`,
    payload
  );
  return response.data;
};

export const useUpdateBatchCourses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, action, courseIds }) =>
      updateBatchCourses(batchId, action, courseIds),
    retry: false,
    onSuccess: (_, { batchId }) => {
      // Invalidate the course list for the batch
      queryClient.invalidateQueries({ queryKey: ["courses", batchId]});
    },
  });
};
