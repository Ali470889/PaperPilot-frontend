// api/subject.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";



// Function to fetch subjects
const getSubjects = async (page = 1, size = 10) => {
  const response = await axiosInstance.get(
    `/subject/?page=${page}&size=${size}`
  );
  return response.data;
};

// React Query hook
export const useGetSubjects = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["subjects", page, size],
    queryFn: () => getSubjects(page, size),
    keepPreviousData: true, // helps with pagination smoothness
    retry: false,
  });
};

// --- API call function ---
const createSubject = async (data) => {
  const response = await axiosInstance.post("/subject/", data);
  return response.data;
};

// --- React Query hook ---
export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      // Invalidate cached subjects list to refresh data

      queryClient.invalidateQueries({ queryKey: ["subjects"]});
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create subject!";
      toast.error(message);
    },
  });
};

// Function to update a subject
const updateSubject = async (subject_id, name) => {
  const response = await axiosInstance.patch(`/subject/${subject_id}`, {
    name,
  });
  return response.data;
};

// React Query mutation hook
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subject_id, name }) => updateSubject(subject_id, name),
    onSuccess: () => {
      // Invalidate cached subjects list to refresh data
      queryClient.invalidateQueries({ queryKey: ["subjects"]});
    },
  });
};

// --------------------------------------------------------------------


// Add chapter in a subject

// Function to fetch chapters by subject ID
const getChaptersBySubject = async (subjectId) => {
  const response = await axiosInstance.get(`/subject/${subjectId}/chapters`);
  return response.data;
};

// React Query hook
export const useGetChaptersBySubject = (subjectId) => {
  return useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChaptersBySubject(subjectId),
    enabled: !!subjectId, // prevents running when subjectId is undefined
    retry: false,
  });
};

// --- API call function ---
const addChaptersToSubject = async ({ subject_id, chapter_ids }) => {
  const response = await axiosInstance.post(`/subject/${subject_id}/chapters`, {
    chapter_ids,
  });
  return response.data;
};

// --- React Query hook ---
export const useAddChaptersToSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addChaptersToSubject,

    onSuccess: (_, variables) => {
      // variables = { subject_id, chapter_ids }
      queryClient.invalidateQueries({
        queryKey: ["chapters", variables.subject_id],
      });
      toast.success("Chapters added successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to add chapters to subject!";
      toast.error(message);
    },
  });
};

// --- API call function ---
const removeChapterFromSubject = async ({ subject_id, chapter_ids }) => {
  const response = await axiosInstance.delete(
    `/subject/${subject_id}/chapters`,
    {
      data: { chapter_ids },
    }
  );
  return response.data;
};

// --- React Query hook ---
export const useRemoveChapterFromSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeChapterFromSubject,

    onSuccess: (_, variables) => {
      // variables = { subject_id, course_ids }
      queryClient.invalidateQueries({
        queryKey: ["chapters", variables.subject_id],
      });
      toast.success("Chapter removed successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to remove chapter from subject!";
      toast.error(message);
    },
  });
};



// --------------------------------------------------------------------


// Add Course in a subject

// Function to fetch courses by subject ID
const getCoursesBySubject = async (subjectId) => {
  const response = await axiosInstance.get(`/subject/${subjectId}/courses`);
  return response.data;
};

// React Query hook
export const useGetCoursesBySubject = (subjectId) => {
  return useQuery({
    queryKey: ["courses", subjectId],
    queryFn: () => getCoursesBySubject(subjectId),
    enabled: !!subjectId, // prevents running when subjectId is undefined
    retry: false,
  });
};

// --- API call function ---
const addCoursesToSubject = async ({ subject_id, course_ids }) => {
  const response = await axiosInstance.post(`/subject/${subject_id}/courses`, {
    course_ids,
  });
  return response.data;
};

// --- React Query hook ---
export const useAddCoursesToSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCoursesToSubject,

    onSuccess: (_, variables) => {
      // variables = { subject_id, course_ids }
      queryClient.invalidateQueries({
        queryKey: ["courses", variables.subject_id],
      });
      toast.success("Courses added successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to add courses to subject!";
      toast.error(message);
    },
  });
};

// --- API call function ---
const removeCoursesFromSubject = async ({ subject_id, course_ids }) => {
  const response = await axiosInstance.delete(`/subject/${subject_id}/courses`, {
    data: { course_ids },
  });
  return response.data;
};

// --- React Query hook ---
export const useRemoveCoursesFromSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCoursesFromSubject,

    onSuccess: (_, variables) => {
      // variables = { subject_id, course_ids }
      queryClient.invalidateQueries({
        queryKey: ["courses", variables.subject_id],
      });
      toast.success("Courses removed successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to remove courses from subject!";
      toast.error(message);
    },
  });
};

