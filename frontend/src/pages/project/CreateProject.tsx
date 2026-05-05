import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { createProject } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CreateProject() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProject(workspaceId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      navigate(`/workspaces/${workspaceId}/projects`);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    if (!name || !workspaceId) {
      return;
    }
    mutation.mutate({
      name,
      description: description || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Create project
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Project name"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                rows={3}
                placeholder="Short description"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4  animate-spin" />
              ) : (
                "Create project"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
