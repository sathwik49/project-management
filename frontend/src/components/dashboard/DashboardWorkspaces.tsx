import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { createWorkspace, getAllUserWorkspaces } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardWorkspaces() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllUserWorkspaces,
  });

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const workspaces = (data?.details ?? []).slice(0, 3);

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        <h2 className="text-xl font-semibold text-gray-900">Your Workspaces</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Plus className="h-4 w-4" />
                New workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create workspace</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleCreate}>
                <div className="space-y-1">
                  <label
                    htmlFor="workspace-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="workspace-name"
                    name="name"
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Team workspace"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="workspace-description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="workspace-description"
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
                  {mutation.isPending ? "Creating..." : "Create workspace"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => navigate("/workspaces")}
          >
            See all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Loading workspaces...</CardTitle>
            </CardHeader>
          </Card>
        )}

        {!isLoading && workspaces.length === 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">No workspaces yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create a workspace to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="hover:border-violet-300 transition-colors cursor-pointer"
            onClick={() => navigate(`/workspaces/${workspace.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{workspace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">
                {workspace.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


