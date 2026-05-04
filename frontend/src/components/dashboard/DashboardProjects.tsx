import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createProject, getProjectsInWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, ArrowUpRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/endpoints";
import type { ProjectWithCreator } from "@/api/types";

type DashboardProjectsProps = {
  workspaceId: string;
};

export default function DashboardProjects({
  workspaceId,
}: DashboardProjectsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId), "dashboard"],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId, { pageNumber: 1, pageSize: 4 }),
    enabled: Boolean(workspaceId),
  });

  const mutation = useMutation({
    mutationFn: (formData: { name: string; description?: string }) =>
      createProject(workspaceId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.ANALYTICS(workspaceId),
      });
      setIsOpen(false);
      toast.success("Project created");
    },
    onError: () => toast.error("Failed to create project"),
  });

  const projects: ProjectWithCreator[] = data?.details ?? [];

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name.trim()) return;
    mutation.mutate({ name, description: description || undefined });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-800">Recent Projects</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 gap-1.5 h-9 text-xs"
            >
              <Plus className="h-3 w-3" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 pt-2" onSubmit={handleCreate}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">
                  Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="e.g. Q4 Marketing Campaign"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  rows={3}
                  placeholder="What is this project about?"
                />
              </div>
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-zinc-100 animate-pulse"
            />
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full border border-dashed border-zinc-200 rounded-lg py-8 flex flex-col items-center justify-center text-center bg-white">
            <FolderKanban className="h-5 w-5 text-zinc-300 mb-2" />
            <p className="text-sm font-medium text-zinc-500">No projects yet</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              onClick={() =>
                navigate(`/workspaces/${workspaceId}/projects/${project.id}`)
              }
              className="group bg-white border border-zinc-200/60 hover:border-violet-300 hover:shadow-md rounded-xl p-5 text-left transition-all w-full min-h-25 flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 bg-zinc-50 rounded-lg group-hover:bg-violet-50 transition-colors shrink-0">
                    <FolderKanban className="h-4 w-4 text-zinc-400 group-hover:text-violet-600 transition-colors" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-bold text-zinc-800 group-hover:text-violet-700 transition-colors truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {project.description ||
                        "No description provided for this project."}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-colors shrink-0" />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-50 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                    Active
                  </span>
                </div>
                <span className="text-[10px] text-zinc-300 font-medium italic">
                  Project
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
