import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API call function ---
const getStudentPurchases = async ({
  user_id = null,
  full_name = null,
  email = null,
  plan_id = null,
  purchase_id = null,
  payment_id = null,
  purchase_status = null,
  payment_mode_at_time_of_purchase = null,
  installment_count_at_time_of_purchase = null,
  billable_amount_at_time_of_purchase = null,
  plan_start_date_at_time_of_purchase = null,
  special_discount_reason = null,
  scholarship_discount_amount = null,
  scholarship_discount_reason = null,
  promo_code = null,
  promo_discount_ratio = null,
  promo_discount_amount = null,
  fee_paid_after_discounts = null,
  landing_page_url = null,
  created_at_from = null,
  created_at_to = null,
  transaction_date = null,
  transaction_time = null,
  payment_status = null,
  payment_method = null,
  sequence_number = null,
  installment_amount = null,
  installment_due_date = null,
  installment_status = null,
  page = 1,
  size = 10,
}) => {
  const response = await axiosInstance.get("/shop-purchase/student-purchases", {
    params: {
      user_id,
      full_name,
      email,
      plan_id,
      purchase_id,
      payment_id,
      purchase_status,
      payment_mode_at_time_of_purchase,
      installment_count_at_time_of_purchase,
      billable_amount_at_time_of_purchase,
      plan_start_date_at_time_of_purchase,
      special_discount_reason,
      scholarship_discount_amount,
      scholarship_discount_reason,
      promo_code,
      promo_discount_ratio,
      promo_discount_amount,
      fee_paid_after_discounts,
      landing_page_url,
      created_at_from,
      created_at_to,
      transaction_date,
      transaction_time,
      payment_status,
      payment_method,
      sequence_number,
      installment_amount,
      installment_due_date,
      installment_status,
      page,
      size,
    },
  });

  return response.data;
};



// --- React Query Hook ---
export const useGetStudentPurchases = ({
  user_id = null,
  full_name = null,
  email = null,
  plan_id = null,
  purchase_id = null,
  payment_id = null,
  purchase_status = null,
  payment_mode_at_time_of_purchase = null,
  installment_count_at_time_of_purchase = null,
  billable_amount_at_time_of_purchase = null,
  plan_start_date_at_time_of_purchase = null,
  special_discount_reason = null,
  scholarship_discount_amount = null,
  scholarship_discount_reason = null,
  promo_code = null,
  promo_discount_ratio = null,
  promo_discount_amount = null,
  fee_paid_after_discounts = null,
  landing_page_url = null,
  created_at_from = null,
  created_at_to = null,
  transaction_date = null,
  transaction_time = null,
  payment_status = null,
  payment_method = null,
  sequence_number = null,
  installment_amount = null,
  installment_due_date = null,
  installment_status = null,
  page = 1,
  size = 10,
  enabled = true,
}) => {
  return useQuery({
    queryKey: [
      "getStudentPurchases",
      user_id,
      full_name,
      email,
      plan_id,
      purchase_id,
      payment_id,
      purchase_status,
      payment_mode_at_time_of_purchase,
      installment_count_at_time_of_purchase,
      billable_amount_at_time_of_purchase,
      plan_start_date_at_time_of_purchase,
      special_discount_reason,
      scholarship_discount_amount,
      scholarship_discount_reason,
      promo_code,
      promo_discount_ratio,
      promo_discount_amount,
      fee_paid_after_discounts,
      landing_page_url,
      created_at_from,
      created_at_to,
      transaction_date,
      transaction_time,
      payment_status,
      payment_method,
      sequence_number,
      installment_amount,
      installment_due_date,
      installment_status,
      page,
      size,
    ],
    queryFn: () =>
      getStudentPurchases({
        user_id,
        full_name,
        email,
        plan_id,
        purchase_id,
        payment_id,
        purchase_status,
        payment_mode_at_time_of_purchase,
        installment_count_at_time_of_purchase,
        billable_amount_at_time_of_purchase,
        plan_start_date_at_time_of_purchase,
        special_discount_reason,
        scholarship_discount_amount,
        scholarship_discount_reason,
        promo_code,
        promo_discount_ratio,
        promo_discount_amount,
        fee_paid_after_discounts,
        landing_page_url,
        created_at_from,
        created_at_to,
        transaction_date,
        transaction_time,
        payment_status,
        payment_method,
        sequence_number,
        installment_amount,
        installment_due_date,
        installment_status,
        page,
        size,
      }),
    enabled: enabled && page > 0,
    retry: false,
  });
};




// --- API call function ---
const firstPaymentApproval = async ({
  purchase_id,
  payment_mode,
  payment_status,
  user_id,
}) => {
  const response = await axiosInstance.post(
    "/finance-admin/first-payment-approval",
    null,
    {
      params: {
        purchase_id,
        payment_mode,
        payment_status,
        user_id,
      },
    }
  );

  return response.data;
};



// --- React Query hook ---
export const useFirstPaymentApproval = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: firstPaymentApproval,

        onSuccess: () => {
            toast.success("First payment approved successfully!");

            // Invalidate related finance or purchase queries if needed
            queryClient.invalidateQueries({ queryKey: ["purchases"]});
            queryClient.invalidateQueries({ queryKey: ["payments"]});
        },

        onError: (error) => {
            const message =
                error?.response?.data?.detail?.[0]?.msg ||
                error?.response?.data?.detail ||
                "Failed to approve first payment!";

            toast.error(message);
        },
    });
};
