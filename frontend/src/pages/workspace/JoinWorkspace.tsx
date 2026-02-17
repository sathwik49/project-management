import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { joinWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";

export default function JoinWorkspace() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { invite } = useParams<{ invite: string }>();

  const mutation = useMutation({
    mutationFn: joinWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/dashboard");
    },
  });

  useEffect(() => {
    if (invite) {
      mutation.mutate(invite);
    }
  }, [invite]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">Join workspace</h1>
          <p className="text-sm text-gray-600">
            Joining workspace with invite code:{" "}
            <span className="font-mono">{invite}</span>
          </p>
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={mutation.isPending || !invite}
          >
            {mutation.isPending ? "Joining..." : "Processing invite..."}
          </Button>
        </div>
      </main>
    </div>
  );
}

