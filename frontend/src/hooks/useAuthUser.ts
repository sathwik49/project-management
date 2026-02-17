import { getCurrentUser } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-user"],
    queryFn: getCurrentUser,
    refetchOnMount: false,
    staleTime: 10 * 60 * 1000,
  });
  if (!user) {
    return null;
  }
  return { user, isLoading, isError };
};
