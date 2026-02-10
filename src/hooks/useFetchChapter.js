import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

// --- API call function ---
const getAllChapters = async ({
  chapter_name = null,
  chapter_id = null,
  subject_id = null,
  subject_name = null,
  page = 1,
  size = 10,
}) => {
  const response = await axiosInstance.get("/chapter", {
    params: {
      chapter_name,
      chapter_id,
      subject_id,
      subject_name,
      page,
      size,
    },
  });
  return response.data;
};

// --- React Query hook ---
export const useGetAllChapters = ({
  chapter_name = null,
  chapter_id = null,
  subject_id = null,
  subject_name = null,
  page = 1,
  size = 10,
}) => {
  return useQuery({
    queryKey: [
      "chapters",
      { chapter_name, chapter_id, subject_id, subject_name, page, size },
    ],
    queryFn: () =>
      getAllChapters({
        chapter_name,
        chapter_id,
        subject_id,
        subject_name,
        page,
        size,
      }),
    keepPreviousData: true,
    retry: false,
  });
};

// API function
const updateChapter = async (chapterId, name, subjectId) => {
  const payload = {
    name,
    subject_id: subjectId,
  };

  const response = await axiosInstance.patch(
    `/chapter/${chapterId}`,
    payload
  );
  return response.data;
};

// React Query hook
export const useUpdateChapter = () => {
  return useMutation({
    mutationFn: ({ chapterId, name, subjectId }) =>
      updateChapter(chapterId, name, subjectId),
    retry: false,
  });
};

const createChapter = async (data) => {
  try {
    const response = await axiosInstance.post("/chapter", {
      name: data.name,
      subject_id: data.subject_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"]});
      toast.success("Chapter created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create chapter!";
      toast.error(message);
    },
  });
};

// --- API call to get topics by chapter ID ---
const getTopicsByChapter = async (chapter_id) => {
  const response = await axiosInstance.get(`/chapter/${chapter_id}/topics`);
  return response.data;
};

// --- React Query hook ---
export const useGetTopicsByChapter = (chapter_id) => {
  return useQuery({
    queryKey: ["chapter-topics", chapter_id],
    queryFn: () => getTopicsByChapter(chapter_id),
    enabled: !!chapter_id, // only runs when chapter_id is defined
    retry: false,
  });
};

const addTopicsToChapter = async (chapterId, topicIds) => {
  // topicIds is an array of topic IDs
  const payload = topicIds;

  const response = await axiosInstance.post(
    `/chapter/${chapterId}/topics`,
    payload
  );

  return response.data;
};

export const useAddTopicsToChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, topicIds }) =>
      addTopicsToChapter(chapterId, topicIds),

    onSuccess: () => {
      // Invalidate cached data for chapters/topics
      toast.success("Topic added successfully");

      queryClient.invalidateQueries({ queryKey: ["chapter-topics"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },

    retry: false,
  });
};

const removeTopicsFromChapter = async (chapterId, topicIds) => {
  // topicIds is an array of topic IDs to remove
  const payload = topicIds;

  const response = await axiosInstance.delete(
    `/chapter/${chapterId}/topics`,
    {
      data: payload, // DELETE requests send body using the "data" key
    }
  );

  return response.data;
};

export const useRemoveTopicsFromChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterId, topicIds }) =>
      removeTopicsFromChapter(chapterId, topicIds),

    onSuccess: () => {
      // Invalidate cached topic lists for the chapter
      toast.success("Topic removed successfully");
      queryClient.invalidateQueries({ queryKey: ["chapter-topics"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },

    retry: false,
  });
};
