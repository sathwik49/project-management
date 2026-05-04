import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/lib/endpoints";
import { Loader2, ArrowLeft, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateWorkspace() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
      toast.success("Workspace created!");
      navigate("/dashboard");
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name.trim()) return;
    mutation.mutate({ name, description: description || undefined });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/workspaces")}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to workspaces
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-900">
                  Create a workspace
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  A workspace is a shared environment for team collaboration.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-zinc-700"
                  >
                    Workspace name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g. Marketing Team, Engineering"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-zinc-700"
                  >
                    Description{" "}
                    <span className="text-zinc-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    placeholder="What is this workspace for?"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 px-6"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create workspace"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/workspaces")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              <h2 className="text-sm font-semibold text-zinc-800 mb-2">
                What is a workspace?
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                A top-level container for your projects and tasks. Create
                multiple workspaces for different teams or clients.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-zinc-800">
                What you get
              </h2>
              {[
                "Unlimited projects",
                "Team collaboration",
                "Task management",
                "Invite members via link",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  <p className="text-xs text-zinc-500">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
