import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

const AmbassadorBaseURL = import.meta.env.VITE_AMBASSADOR_BASE_URL;
// --- API function ---

const getAllPayments = async ({
  page = 1,
  size = 10,
  email = null,
  payment_status = null,
  payment_id = null,
  user_id = null,
}) => {
  const response = await axiosInstance.get("/shop-payment/", {
    params: {
      page,
      size,
      email,
      payment_status,
      payment_id,
      user_id,
    },
  });
  return response.data;
};
// --- React Query hook ---
export const useGetAllPayments = ({
  page = 1,
  size = 10,
  email = null,
  payment_status = null,
  payment_id = null,
  user_id = null,
}) => {
  return useQuery({
    queryKey: [
      "payments",
      { page, size, email, payment_status, payment_id, user_id },
    ],
    queryFn: () =>
      getAllPayments({
        page,
        size,
        email,
        payment_status,
        payment_id,
        user_id,
      }),
    keepPreviousData: true,
    retry: false,
  });
};

// API function
const updatePaymentStatus = async ({
  payment_status,
  enrollment_status,
  installment_status,
  payment_id,
  purchase_id,
  user_id,
  rejection_reason = null,
  item_id = null,
  item_type = null,
  item_name = null,
  user_email = null,
  user_full_name = null,
  package_bought = null,
}) => {
  const response = await axiosInstance.patch(
    `/shop-payment/update-status`,
    {
      params: {
        payment_status,
        enrollment_status,
        installment_status,
        payment_id,
        purchase_id,
        user_id,
        rejection_reason,
        item_id,
        item_type,
        item_name,
        user_email,
        user_full_name,
        package_bought,
      },
    }
  );
  return response.data;
};
// React Query hook
export const useUpdatePaymentStatus = () => {
  return useMutation({
    mutationFn: ({
      payment_status,
      enrollment_status,
      installment_status,
      payment_id,
      purchase_id,
      user_id,
      rejection_reason,
      item_id,
      item_type,
      item_name,
      user_email,
      user_full_name,
      package_bought,
    }) =>
      updatePaymentStatus({
        payment_status,
        enrollment_status,
        installment_status,
        payment_id,
        purchase_id,
        user_id,
        rejection_reason,
        item_id,
        item_type,
        item_name,
        user_email,
        user_full_name,
        package_bought,
      }),
    retry: false,
  });
};




// ---- API Function ----
const getAllShopPayments = async ({
  payment_status = null,
  payment_id = null,
  user_id = null,
}) => {
  const response = await axiosInstance.get("/shop-payment/lms-admin", {
    params: {
      payment_status,
      payment_id,
      user_id,
    },
  });
  return response.data;
};
// ---- React Query Hook ----
export const useGetAllShopPayments = ({
  payment_status = null,
  payment_id = null,
  user_id = null,
}) => {
  return useQuery({
    queryKey: ["shop-payments", { payment_status, payment_id, user_id }],
    queryFn: () =>
      getAllShopPayments({
        payment_status,
        payment_id,
        user_id,
      }),
    keepPreviousData: true,
    retry: false,
  });
};
