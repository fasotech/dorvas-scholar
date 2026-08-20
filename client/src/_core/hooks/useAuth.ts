
import { trpc } from "../../lib/trpc";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["auth", "me"]] });
      window.location.href = "/login";
    }
  });

  return {
    user: user || null,
    loading: isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMutation.mutate()
  };
}

