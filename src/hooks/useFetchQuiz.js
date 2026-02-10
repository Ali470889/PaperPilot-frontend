import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API call function ---
const searchQuiz = async ({
  quiz_id = null,
  quiz_name = null,
  page = 1,
  page_size = 100,
}) => {
  const response = await axiosInstance.get("/quiz/quizzes/search", {
    params: { quiz_id, quiz_name, page, page_size },
  });
  return response.data;
};

// --- React Query hook ---
export const useSearchQuiz = ({
  quiz_id = null,
  quiz_name = null,
  page = 1,
  page_size = 10,
}) => {
  return useQuery({
    queryKey: ["searchQuiz", quiz_id, quiz_name, page, page_size],
    queryFn: () => searchQuiz({ quiz_id, quiz_name, page, page_size }),
    enabled: page > 0, // allow running even if quiz_name is null
    retry: false,
  });
};

const updateQuiz = async ({ quiz_id, data }) => {
  const response = await axiosInstance.put(`/quiz/${quiz_id}`, data);
  return response.data;
};

// --- React Query hook ---
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuiz,

    onSuccess: (response) => {
      toast.success("Quiz updated successfully!");

      queryClient.invalidateQueries({
        queryKey: ["searchQuiz"],
      });
    },

    onError: (error) => {
      const message = error?.response?.data?.detail || "Failed to update quiz!";
      toast.error(message);
    },
  });
};

// Get quiz questions by Quiz_id

const getQuizQuestions = async (quiz_id) => {
  if (!quiz_id) throw new Error("quiz_id is required");
  const response = await axiosInstance.get(`/quiz/${quiz_id}/questions`);
  return response.data;
};

export const useGetQuizQuestions = (quiz_id) => {
  return useQuery({
    queryKey: ["quizQuestions", quiz_id],
    queryFn: () => getQuizQuestions(quiz_id),
    enabled: !!quiz_id, // runs only when quiz_id is provided
    retry: false,
  });
};

// Create Quiz CSV Api

const uploadQuizCSV = async (formData) => {
  const response = await axiosInstance.post("/quiz/upload-csv", formData, {
    parseJson: false,        // important → don't JSON encode
    headers: {},             // no manual Content-Type
  });
  console.log("response");
  console.log(response);

  return response.data;
};

export const useUploadQuizCSV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadQuizCSV,
    onSuccess: () => {
      toast.success("Quiz created successfully from CSV!");
      queryClient.invalidateQueries({ queryKey: ["searchQuiz"] });
    },
  });
};


// Quiz Question linkage

// --- API call function ---
const addOrUpdateQuizQuestions = async ({ quiz_id, action, data }) => {
  const response = await axiosInstance.post(
    `/quiz/${quiz_id}/questions?action=${action}`,
    data
  );
  return response.data;
};

// --- React Query hook ---
export const useAddOrUpdateQuizQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrUpdateQuizQuestions,
    onSuccess: (_, variables) => {
      // Invalidate the query for the same quiz_id
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions"],
      });
      toast.success("Quiz questions updated successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to add or update quiz questions!";
      toast.error(message);
    },
  });
};

const updateQuestionOrder = async ({ quiz_id, questions }) => {
  const response = await axiosInstance.patch(
    `/quiz/${quiz_id}/questions/order`,
    questions // Expected format: [{ order: 0, question_id: 0 }]
  );
  return response.data;
};

export const useUpdateQuestionOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionOrder,

    onSuccess: (response, variables) => {
      toast.success("Question order updated successfully!");

      // Invalidate cache for the quiz's question list
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions", variables.quiz_id],
      });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail || "Failed to update question order!";
      toast.error(message);
    },
  });
};
