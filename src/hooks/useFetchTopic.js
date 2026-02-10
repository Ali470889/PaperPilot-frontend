import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// API call to get all topics
const getAllTopics = async ({
  page = 1,
  size = 10,
  topic_id = null,
  topic_name = null,
  chapter_id = null,
  chapter_name = null,
}) => {
  const response = await axiosInstance.get(
    `/topic`, {
    params: {
      page,
      size,
      topic_id,
      topic_name,
      chapter_id,
      chapter_name
    },
  });
  return response.data;
};
// React Query hook
export const useGetAllTopics = ({
  page = 1,
  size = 10,
  topic_id = null,
  topic_name = null,
  chapter_id = null,
  chapter_name = null,
}) => {
  return useQuery({
    queryKey: ["topics", page, size, topic_id, topic_name, chapter_id, chapter_name],
    queryFn: () =>
      getAllTopics({ page, size, topic_id, topic_name, chapter_id, chapter_name }),
    keepPreviousData: true,
    retry: false,
  });
};

// API function
const updateTopic = async (topicId, name, chapterId) => {
  const payload = {
    name,
    chapter_id: chapterId,
  };

  const response = await axiosInstance.patch(`/topic/${topicId}`, payload);
  return response.data;
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, name, chapterId }) =>
      updateTopic(topicId, name, chapterId),
    retry: false,
    onSuccess: () => {
      toast.success("Topic updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update topic.");
    },
  });
};

// --- API call function ---
const createTopic = async (data) => {
  const response = await axiosInstance.post("/topic", data);
  return response.data;
};

// --- React Query hook ---
export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      // Invalidate cached topic list to refresh data
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Topic created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create topic!";
      toast.error(message);
    },
  });
};
