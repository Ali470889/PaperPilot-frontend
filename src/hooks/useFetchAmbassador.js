import { ambassadorInstance } from "@/services/api/ambassadorInstance";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


const postAmbassadorSales = async ({
    landing_page_url,
    customer_name,
    customer_email,
    package_bought,
    purchase_type,
    special_discount_ratio,
    promo_discount_ratio,
    actual_fee,
    paid_fee,
    promo_code,
    item_id,
    item_name,
    item_type,
}) => {
    const response = await ambassadorInstance.post("/mdcat-sales/", {
        landing_page_url,
        customer_name,
        customer_email,
        package_bought,
        purchase_type,
        special_discount_ratio,
        promo_discount_ratio,
        actual_fee,
        paid_fee,
        promo_code,
        item_id,
        item_name,
        item_type,
    });
    return response.data;
};
// React Query hook
export const usePostAmbassadorSales = () => {    
    return useMutation({
        mutationFn: ({
            landing_page_url,
            customer_name,
            customer_email,
            package_bought,
            purchase_type,
            special_discount_ratio,
            promo_discount_ratio,
            actual_fee,
            paid_fee,
            promo_code,
            item_id,
            item_name,
            item_type,
        }) =>
            postAmbassadorSales({
                landing_page_url,
                customer_name,
                customer_email,
                package_bought,
                purchase_type,
                special_discount_ratio,
                promo_discount_ratio,
                actual_fee,
                paid_fee,
                promo_code,
                item_id,
                item_name,
                item_type,
            }),
        retry: false,
    });
};


// DELETE MDCAT sale by customer email + item ID
const deleteMdcatSale = async ({ customer_email, item_id }) => {
    const response = await ambassadorInstance.delete(
        `/mdcat-sales/${customer_email}/${item_id}`
    );
    return response.data;
};

export const useDeleteMdcatSale = () => {
    return useMutation({
        mutationFn: ({ customer_email, item_id }) =>
            deleteMdcatSale({ customer_email, item_id }),

        // optional callbacks
        onSuccess: (data) => {
            console.log("Deleted:", data);
        },
        onError: (error) => {
            console.error("Delete failed:", error);
        },
    });
};