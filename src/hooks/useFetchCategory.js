import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";


// --- API call function ---
const getAllCategories = async ({
    id,
    name,
    allow_promo_usage,
    only_active_sale = false,
    page = 1,
    size = 10,
    fetch_all = false,
}) => {
    const response = await axiosInstance.get("/shop-category", {
        params: {
            id,
            name,
            allow_promo_usage,
            only_active_sale,
            page,
            size,
            fetch_all,
        },
    });
    return response.data;
};
// --- React Query hook ---
export const useGetAllCategories = ({
    enabled = true,
    id,
    name,
    allow_promo_usage,
    only_active_sale = false,
    page = 1,
    size = 10,
    fetch_all = false,
} = {}) => {
    return useQuery({
        queryKey: [
            "categories",
            { id, name, allow_promo_usage, only_active_sale, page, size, fetch_all },
        ],
        queryFn: () =>
            getAllCategories({
                id,
                name,
                allow_promo_usage,
                only_active_sale,
                page,
                size,
                fetch_all,
            }),
        enabled,
        retry: false,
        keepPreviousData: true, // nice for pagination UX
    });
};



// --- API call function ---
const createCategory = async (data) => {
    const response = await axiosInstance.post(
        "/shop-category",
        null,
        {
            params: {
                category_name: data.category_name,
            },
        }
    );
    return response.data;
};
// --- React Query hook ---
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,

        onSuccess: () => {
            toast.success("Category created successfully");

            // Invalidate category list if you have one
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },

        onError: (error) => {
            const message =
                error?.response?.data?.detail?.[0]?.msg ||
                error?.response?.data?.detail ||
                "Failed to create category";

            toast.error(message);
        },
    });
};



// --- API call function ---
const getCategoryAuditLogs = async (category_id) => {
    const response = await axiosInstance.get(
        `/shop-category/audit-logs/${category_id}`
    );
    return response.data;
};

// --- React Query hook ---
export const useGetCategoryAuditLogs = ({
    enabled = true,
    category_id,
} = {}) => {
    return useQuery({
        queryKey: ["category-audit-logs", { category_id }],
        queryFn: () => getCategoryAuditLogs(category_id),
        enabled: enabled && !!category_id, // don't run if id is missing
        retry: false,
        keepPreviousData: true,
    });
};


// --- API call function ---
const changeCategoryPromoDetails = async ({ category_id, data }) => {
    const response = await axiosInstance.put(
        `/shop-category/change-promo-details/${category_id}`,
        data
    );

    return response.data;
};

// --- React Query hook ---
export const useChangeCategoryPromoDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changeCategoryPromoDetails,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },

        onError: (error) => {
            const message =
                error?.response?.data?.detail?.[0]?.msg ||
                error?.response?.data?.detail ||
                "Failed to update category promo details";

            toast.error(message);
        },
    });
};



// --- API call function ---
const changeCategorySaleDetails = async ({ category_id, data }) => {
  const response = await axiosInstance.put(
    `/shop-category/change-sale-details/${category_id}`,
    data
  );

  return response.data;
};

// --- React Query hook ---
export const useChangeCategorySaleDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeCategorySaleDetails,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to update category sale details";

      toast.error(message);
    },
  });
};
