import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API Function ---
const getAllInstallments = async ({
    page = 1,
    size = 10,
    email = null,
}) => {
    const response = await axiosInstance.get("/shop-installment/installments", {
        params: {
            page,
            size,
            email,
        },
    });
    return response.data;
};

// --- React Query Hook ---
export const useGetAllInstallments = ({
    page = 1,
    size = 10,
    email = null,
}) => {
    return useQuery({
        queryKey: ["installments", { page, size, email }],
        queryFn: () => getAllInstallments({ page, size, email }),
        keepPreviousData: true,
        retry: false,
    });
};



// API function
const convertFullToInstallment = async (purchaseId, userId, paid_fee, installments) => {
    const payload = {
        paid_fee,
        installments,
    };

    const response = await axiosInstance.patch(
        `/shop-purchase/${purchaseId}/full-to-installment/${userId}`,
        payload
    );

    return response.data;
};

// React Query hook
export const useConvertFullToInstallment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ purchaseId, userId, paid_fee, installments }) =>
            convertFullToInstallment(purchaseId, userId, paid_fee, installments),

        onSuccess: () => {
            // Refresh relevant data after successful conversion
            queryClient.invalidateQueries({ queryKey: ["shopPurchases"] });
        },

        retry: false,
    });
};
