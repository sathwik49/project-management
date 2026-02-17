import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWorkspaceById,
  getWorkspaceAnalytics,
  getWorkspaceMembers,
  createProject,
} from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function WorkspaceDetail() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const { data: workspaceData, isLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceById(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["workspaceAnalytics", workspaceId],
    queryFn: () => getWorkspaceAnalytics(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  const { data: membersData } = useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  const workspace = workspaceData?.details?.workspace;
  const members = membersData?.details ?? [];
  const analytics = analyticsData?.details;

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProject(workspaceId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });

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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {isLoading && (
          <div className="text-gray-700">Loading workspace...</div>
        )}

        {!isLoading && workspace && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {workspace.name}
                </h1>
                <p className="text-sm text-gray-600 max-w-2xl">
                  {workspace.description || "No description"}
                </p>
                <p className="text-xs text-gray-500">
                  Invite code: {workspace.inviteCode}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
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
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = `${window.location.origin}/workspace/join/${workspace.inviteCode}`;
                    navigator.clipboard
                      ?.writeText(link)
                      .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      })
                      .catch(() => {});
                  }}
                >
                  {copied ? "Copied" : "Copy invite link"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">
                    {analytics ? analytics.totalTasks : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overdue tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-red-600">
                    {analytics ? analytics.overdueTasks : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Completed tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-emerald-600">
                    {analytics ? analytics.completedTasks : "-"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 && (
                  <p className="text-sm text-gray-600">
                    No members found in this workspace.
                  </p>
                )}
                {members.length > 0 && (
                  <ul className="space-y-2">
                    {members.map((member) => (
                      <li
                        key={member.user.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            {member.user.name || member.user.email}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {member.user.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs">
                          {member.role.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

