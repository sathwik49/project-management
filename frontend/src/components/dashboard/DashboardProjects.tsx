import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProject, getProjectsInWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DashboardProjectsProps = {
  workspaceId: string | null;
};

export default function DashboardProjects({
  workspaceId,
}: DashboardProjectsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId as string, {
        pageNumber: 1,
        pageSize: 6,
      }),
    enabled: Boolean(workspaceId),
  });

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProject(workspaceId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });

  const projects = data?.details?.projects ?? [];

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspaceId) return;
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    if (!name) return;
    mutation.mutate({
      name,
      description: description || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-violet-600 hover:bg-violet-700 gap-2"
              disabled={!workspaceId}
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-1">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="project-name"
                  name="name"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Project name"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="project-description"
                  name="description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
                  rows={3}
                  placeholder="Short description"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Loading projects...</CardTitle>
            </CardHeader>
          </Card>
        )}

        {!isLoading && projects.length === 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">No projects yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create your first project to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:border-violet-300 transition-colors cursor-pointer"
            onClick={() =>
              workspaceId &&
              navigate(`/workspaces/${workspaceId}/projects/${project.id}`)
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
