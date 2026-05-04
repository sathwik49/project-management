import { getCurrentUser } from "@/api/api";
import { QUERY_KEYS } from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const { data, isLoading, isError,error } = useQuery({
    queryKey: QUERY_KEYS.USER.CURRENT,
    queryFn: getCurrentUser,
    retry: false,
    refetchOnMount: false,
  });

  return {
    data,
    isLoading,
    isError,
    error
  };
};
