import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

// --- API call function ---
const getAllCourse = async ({
  course_id = null,
  course_name = null,
  page = 1,
  page_size = 10,
}) => {
  const response = await axiosInstance.get("/courses/", {
    params: { course_id, course_name, page, page_size },
  });
  return response.data;
};

// --- React Query hook ---
export const useGetAllCourse = ({
  course_id = null,
  course_name = null,
  page = 1,
  page_size = 10,
  enabled = true
}) => {
  return useQuery({
    queryKey: ["searchCourse", course_id, course_name, page, page_size],
    queryFn: () => getAllCourse({ course_id, course_name, page, page_size }),
    enabled: page > 0,
    retry: false,
    enabled: enabled
  });
};

const createCourse = async (data) => {
  const response = await axiosInstance.post("/courses/", data);
  return response.data;
};

// --- React Query hook ---
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      // Invalidate cached courses list to refresh data
      queryClient.invalidateQueries({ queryKey: ["searchCourse"] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create course!";
      toast.error(message);
    },
  });
};

// API function
const updateCourse = async (
  courseId,
  name,
  description,
  courseImageUrl,
  subject_ids
) => {
  const payload = {
    name,
    description,
    course_image_url: courseImageUrl,
    subject_ids: subject_ids,
  };

  const response = await axiosInstance.patch(`/courses/${courseId}`, payload);
  return response.data;
};

// React Query hook
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, name, description, courseImageUrl, subject_ids }) =>
      updateCourse(courseId, name, description, courseImageUrl, subject_ids),
    onSuccess: () => {
      // Invalidate cache for all "searchCourse" queries
      queryClient.invalidateQueries({ queryKey: ["searchCourse"] });
    },

    retry: false,
  });
};

// --- API call function ---
const getCourseById = async (course_id) => {
  if (!course_id) throw new Error("course_id is required");

  const response = await axiosInstance.get(`/courses/${course_id}`);
  return response.data;
};

// --- React Query hook ---
export const useGetCourseById = (course_id) => {
  return useQuery({
    queryKey: ["course", course_id],
    queryFn: () => getCourseById(course_id),
    enabled: !!course_id, // only run when course_id exists
    retry: false,
  });
};
