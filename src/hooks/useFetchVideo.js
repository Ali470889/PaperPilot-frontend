import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";
import { toast } from "sonner";



const getAllVideos = async ({
  page = 1,
  size = 10,
  video_name = null,
  video_id = null,
}) => {

  const response = await axiosInstance.get(`/video/`, {
    params: {
      page,
      size,
      video_name,
      video_id,
    },
  });
  return response.data;
};

// React Query hook
export const useGetAllVideos = ({
  page = 1,
  size = 10,
  video_name = null,
  video_id = null,
}) => {
  return useQuery({
    queryKey: ["videos", page, size, video_name, video_id],
    queryFn: () => getAllVideos({ page, size, video_name, video_id }),
    keepPreviousData: true,
  });
};

// API function
const updateVideo = async (
  videoId,
  { name, url, description, duration, notes_url, notes_embed_url }
) => {
  const payload = {
    name,
    url,
    description,
    duration,
    notes_url,
    notes_embed_url,
  };

  const response = await axiosInstance.put(`/video/${videoId}`, payload);
  return response.data;
};

// React Query hook
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      videoId,
      name,
      url,
      description,
      duration,
      notes_url,
      notes_embed_url,
    }) =>
      updateVideo(videoId, {
        name,
        url,
        description,
        duration,
        notes_url,
        notes_embed_url,
      }),
    retry: false,
    onSuccess: () => {
      toast.success("Video updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update video."
      );
    },
  });
};



// --- API call function ---
const createVideo = async (data) => {
  const response = await axiosInstance.post("/video/", data);
  return response.data;
};


export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["videos"]
      });
      toast.success("Video created successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create video!";
      toast.error(message);
    },
  });
};