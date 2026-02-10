import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";

const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

// React Query hook
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUserSidebar"],
    queryFn: getCurrentUser,
    retry: false,
  });
};


