import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, deleteProject } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/lib/endpoints";
import { Loader2, Save, AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ProjectSettings() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: projectData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PROJECT.DETAIL(workspaceId!, projectId!),
    queryFn: () => getProjectById(workspaceId!, projectId!),
    enabled: Boolean(workspaceId && projectId),
  });

  const updateMutation = useMutation({
    mutationFn: (values: { name: string; description?: string }) =>
      updateProject(workspaceId!, projectId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId!),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.DETAIL(workspaceId!, projectId!),
      });
      toast.success("Project updated");
    },
    onError: (err) => {
      let message = "Update failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message || message;
      }
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(workspaceId!, projectId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId!),
      });
      toast.success("Project deleted");
      navigate(`/workspaces/${workspaceId}`);
    },
    onError: (err) => {
      let message = "Deletion failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message || message;
      }
      toast.error(message);
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  const project = projectData?.details;

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back to Project
        </button>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-zinc-900">
            Project Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase text-zinc-400">
                Project Name
              </Label>
              <Input
                name="name"
                defaultValue={project?.name}
                required
                className="focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase text-zinc-400">
                Description
              </Label>
              <Textarea
                name="description"
                defaultValue={project?.description || ""}
                rows={4}
                className="focus-visible:ring-violet-500"
              />
            </div>
            <Button
              disabled={updateMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700 h-9 text-xs font-bold"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-rose-50/20">
        <CardHeader>
          <CardTitle className="text-lg text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600 leading-relaxed">
            Deleting this project will permanently remove all associated tasks
            and data. This action cannot be undone.
          </p>
          {!isDeleting ? (
            <Button
              variant="destructive"
              className="h-9 text-xs font-bold shadow-sm bg-rose-600 hover:bg-rose-700"
              onClick={() => setIsDeleting(true)}
            >
              Delete Project
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                )}
                Confirm Delete
              </Button>
              <Button
                variant="outline"
                className="h-9 text-xs font-bold border-zinc-200"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
