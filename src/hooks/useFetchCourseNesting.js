import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/services/api/axiosInstance";

// --- API call function ---
const getCourseNestingOrder = async (course_id) => {
  const response = await axiosInstance.get(
    `/nesting-order/admin/${course_id}`
  );
  return response.data;
};

// --- React Query hook ---
export const useGetCourseNestingOrder = (course_id) => {
  return useQuery({
    queryKey: ["courseNestingOrder", course_id],
    queryFn: () => getCourseNestingOrder(course_id),
    enabled: !!course_id, // only run when course_id is valid
    retry: false,
  });
};

// --- API function ---
const processCourseNestingOrder = async ({
  course_id,
  nesting_data,
  items_count,
  course_items_json,
}) => {
  let data = {
    nesting_data: nesting_data,
    course_items_json: course_items_json,
  };

  const response = await axiosInstance.post(
    `/nesting-order/${course_id}?items_count=${items_count}`,
    data
  );
  return response.data;
};

// --- React Query hook ---
export const useProcessCourseNestingOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processCourseNestingOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "courseNestingOrder",
          variables.course_id,
        ]
      });
      toast.success("Course nesting order processed successfully!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to process nesting order!";
      toast.error(message);
    },
  });
};

// --- API function ---
const deleteCourseNestingRelation = async ({
  courseId,
  parent_id,
  child_id,
}) => {


  const response = await axiosInstance.delete(
    `/nesting-order/${courseId}`,
    {
      parent_id,
      child_id,
    }
  );
  return response.data;
};

// --- React Query hook ---
export const useDeleteCourseNestingRelation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      parent_id,
      child_id,
      // items_count,
      // course_items_json,
    }) =>
      deleteCourseNestingRelation({
        courseId,
        parent_id,
        child_id,
        // items_count,
        // course_items_json,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courseNestingOrder", variables.courseId] }); // refresh nesting data
      toast.success("Nesting relation removed successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to remove nesting relation!";
      toast.error(message);
    },

    retry: false,
  });
};





// --- API call ---
const addNestingItem = async ({
  course_id,
  parent_id,
  child_id,
  date_of_availability,
  items_count,
  body,
}) => {



  const response = await axiosInstance.post(
    `/nesting-order/${course_id}/nesting/add`,
    body,
    {
      params: {
        parent_id,
        child_id,
        date_of_availability,
        items_count,
      },
    }
  );

  return response.data;
};



// --- React Query hook ---
export const useAddNestingItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNestingItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nesting-order"] });
      toast.success("Item added to nesting order!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to add nesting item!";
      toast.error(message);
    },
  });
};



// --- API call ---
const reorderNestingItem = async ({ course_id, child_id, new_parent_id, new_order, date_of_availability }) => {
  const response = await axiosInstance.post(
    `/nesting-order/${course_id}/nesting/reorder`,
    null,  // Body is empty because all params are in query
    {
      params: {
        child_id,
        new_parent_id,
        new_order,
        date_of_availability,
      },
    }
  );

  return response.data;
};


// --- React Query hook ---
export const useReorderNestingItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderNestingItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nesting-order"] });
      toast.success("Item reordered successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to reorder item!";
      toast.error(message);
    },
  });
};




// --- API call ---
const updateNestingItemDate = async ({
  course_id,
  parent_id,
  child_id,
  date_of_availability,
}) => {
  const response = await axiosInstance.patch(
    `/nesting-order/${course_id}/nesting/update-date`,
    {
      params: {
        parent_id,
        child_id,
        date_of_availability, // Must be ISO string
      },
    }
  );

  return response.data;
};


// --- React Query hook ---
export const useUpdateNestingItemDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNestingItemDate,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nesting-order"] });
      toast.success("Item date updated successfully!");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.detail ||
        "Failed to update date!";
      toast.error(message);
    },
  });
};
