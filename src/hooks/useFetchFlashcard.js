import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API Function ---
const getAllFlashcards = async ({
    page = 1,
    page_size = 10,
    front_text = null,
    back_text = null,
    date_of_availability = null,
    flashcard_id = null,
}) => {
    const response = await axiosInstance.get("/flashcard/", {
        params: {
            page,
            page_size,
            front_text,
            back_text,
            date_of_availability,
            flashcard_id,
        },
    });

    return response.data;
};


// --- React Query Hook ---
export const useGetAllFlashcards = ({
    page = 1,
    page_size = 10,
    front_text = null,
    back_text = null,
    date_of_availability = null,
    flashcard_id = null,
}) => {
    return useQuery({
        queryKey: [
            "flashcards",
            { page, page_size, front_text, back_text, date_of_availability, flashcard_id },
        ],
        queryFn: () =>
            getAllFlashcards({
                page,
                page_size,
                front_text,
                back_text,
                date_of_availability,
                flashcard_id,
            }),
        keepPreviousData: true,
        retry: false,
    });
};


// --- API function ---
const createFlashcard = async (data) => {
    const response = await axiosInstance.post("/flashcard/", data);
    return response.data;
};

// --- React Query hook ---
export const useCreateFlashcard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createFlashcard,
        onSuccess: () => {
            // Refresh flashcards list after creation
            queryClient.invalidateQueries({ queryKey: ["flashcards"]});
            toast.success("Flashcard created successfully!");
        },
        onError: (error) => {
            const message =
                error?.response?.data?.detail?.[0]?.msg ||
                error?.response?.data?.detail ||
                "Failed to create flashcard!";
            toast.error(message);
        },
    });
};


// API function
const updateFlashcard = async (flashcardId, frontText, backText, dateOfAvailability) => {
    const payload = {
        front_text: frontText,
        back_text: backText,
        date_of_availability: dateOfAvailability,
    };

    const response = await axiosInstance.put(`/flashcard/${flashcardId}`, payload);
    return response.data;
};

export const useUpdateFlashcard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ flashcardId, frontText, backText, dateOfAvailability }) =>
            updateFlashcard(flashcardId, frontText, backText, dateOfAvailability),

        retry: false,

        onSuccess: () => {
            toast.success("Flashcard updated successfully.");
            queryClient.invalidateQueries({ queryKey: ["flashcards"] });
        },

        onError: (error) => {
            toast.error(error?.message || "Failed to update flashcard.");
        },
    });
};


const uploadFlashcards = async (formData) => {
    const response = await axiosInstance.post("/flashcard/bulk-upload", formData, {
        parseJson: false,     // same as quiz upload
        headers: {},          // let browser set Content-Type with boundary
    });
    return response.data;
};



export const useUploadFlashcards = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFlashcards,
        onSuccess: () => {
            toast.success("Flashcards uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["flashcards"] });
        },
        onError: (error) => {
            const detail = error?.detail;

            if (detail?.errors?.length) {
                detail.errors.forEach((e) => {
                    const msg = `Row ${e.row}: ${e.errors.join(", ")}`;
                    toast.error(msg);
                });
            } else if (detail?.message) {
                toast.error(detail.message);
            } else {
                toast.error("Failed to upload flashcards!");
            }
        },
    });
};





