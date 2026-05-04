import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { joinWorkspace } from "@/api/api";
import { QUERY_KEYS } from "@/lib/endpoints";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/useAuthUser"; // Assuming this is your hook path
import toast from "react-hot-toast";
import axios from "axios";

export default function JoinWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { invite } = useParams<{ invite: string }>();

  const { data, isLoading: isAuthLoading } = useAuthUser();
  const hasJoined = useRef(false);
  const user = data?.details;

  const mutation = useMutation({
    mutationFn: joinWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
      toast.success("Joined workspace!");
      setTimeout(() => navigate("/dashboard"), 1000);
    },
    onError: (err) => {
      let message = "Invalid or expired invite code";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message || message;
      }
      toast.error(message);
    },
  });

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      const currentPath = encodeURIComponent(location.pathname);
      navigate(`/sign-in?back=${currentPath}`);
      return;
    }

    if (invite && !hasJoined.current) {
      hasJoined.current = true;
      mutation.mutate(invite);
    }
  }, [invite, user, isAuthLoading, navigate, location.pathname]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-10 w-full max-w-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto">
          {mutation.isPending ? (
            <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
            </div>
          ) : mutation.isSuccess ? (
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          ) : mutation.isError ? (
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-rose-500" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-zinc-50 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-zinc-300 animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {mutation.isPending && (
            <>
              <h1 className="text-lg font-bold text-zinc-900">
                Joining workspace...
              </h1>
              <p className="text-sm text-zinc-400">
                Processing invite code{" "}
                <span className="font-mono text-zinc-600 font-bold">
                  {invite}
                </span>
              </p>
            </>
          )}

          {mutation.isSuccess && (
            <>
              <h1 className="text-lg font-bold text-zinc-900">You're in!</h1>
              <p className="text-sm text-zinc-400">
                Successfully joined. Redirecting you now...
              </p>
            </>
          )}

          {mutation.isError && (
            <>
              <h1 className="text-lg font-bold text-zinc-900">
                Invalid invite
              </h1>
              <p className="text-sm text-zinc-400">
                This invite code is invalid, expired, or you are already a
                member.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  variant="outline"
                  className="h-9 text-xs font-bold"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button
                  className="h-9 text-xs font-bold bg-violet-600 hover:bg-violet-700"
                  onClick={() => navigate("/workspaces")}
                >
                  My Workspaces
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
