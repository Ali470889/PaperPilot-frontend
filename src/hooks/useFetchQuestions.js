import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API call function ---
const searchQuestion = async ({
  question_name = null,
  option_name = null,
  explanation_text = null,
  question_id = null,
  topic_id = null,
  subject_id = null,
  chapter_id = null,
  is_flashcard = null,
  page = 1,
  page_size = 10,
}) => {
  const response = await axiosInstance.get("/question/search/custom-params", {
    params: {
      question_name,
      option_name,
      explanation_text,
      question_id,
      topic_id,
      subject_id,
      chapter_id,
      is_flashcard,
      page,
      page_size,
    },
  });
  return response.data;
};

// --- React Query hook ---
export const useSearchQuestion = ({
  question_name = null,
  option_name = null,
  explanation_text = null,
  question_id = null,
  topic_id = null,
  subject_id = null,
  chapter_id = null,
  is_flashcard = null,
  page = 1,
  page_size = 10,
}) => {
  return useQuery({
    queryKey: [
      "searchQuestion",
      question_name,
      option_name,
      explanation_text,
      question_id,
      topic_id,
      subject_id,
      chapter_id,
      is_flashcard,
      page,
      page_size,
    ],
    queryFn: () =>
      searchQuestion({
        question_name,
        option_name,
        explanation_text,
        question_id,
        topic_id,
        subject_id,
        chapter_id,
        is_flashcard,
        page,
        page_size,
      }),
    enabled: page > 0,
    retry: false,
  });
};

// updateQuestion by id

const updateQuestion = async ({ question_id, data }) => {
  const response = await axiosInstance.put(
    `/question/questions/${question_id}`,
    data
  );
  return response.data;
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestion,

    onSuccess: (response, variables) => {
      toast.success("Question updated successfully!");

      // Invalidate the specific quiz's question list
      queryClient.invalidateQueries({
        queryKey: ["quizQuestions"],
      });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail || "Failed to update question!";
      toast.error(message);
    },
  });
};

// Create a new Question

// --- API call function ---
const createQuestion = async (data) => {
  const response = await axiosInstance.post("/question/questions", data);
  return response.data;
};

// --- React Query hook ---
export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: createQuestion,
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to create question!";
      toast.error(message);
    },
  });
};
