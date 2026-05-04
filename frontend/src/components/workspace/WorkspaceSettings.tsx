import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  changeWorkspaceMemberRole,
} from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEYS } from "@/lib/endpoints";
import {
  Loader2,
  Save,
  AlertCircle,
  Users,
  Shield,
  ArrowLeft,
  UserCog,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function WorkspaceSettings() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {},
  );

  const { data: workspaceData, isLoading: isWorkspaceLoading } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.DETAIL(workspaceId!),
    queryFn: () => getWorkspaceById(workspaceId!),
  });

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.MEMBERS(workspaceId!),
    queryFn: () => getWorkspaceMembers(workspaceId!),
  });

  const updateMutation = useMutation({
    mutationFn: (values: { name: string; description?: string }) =>
      updateWorkspace(workspaceId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.DETAIL(workspaceId!),
      });
      toast.success("Settings updated");
    },
    onError: (err) => {
      let message = "Update failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message;
      }
      toast.error(message);
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ memberId, roleId }: { memberId: string; roleId: string }) =>
      changeWorkspaceMemberRole(workspaceId!, { memberId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.MEMBERS(workspaceId!),
      });
      toast.success("Role updated");
    },
    onError: (err) => {
      let message = "Failed to change role";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message;
      }
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkspace(workspaceId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      toast.success("Workspace deleted");
      navigate("/workspaces");
    },
    onError: (err) => {
      let message = "Failed to delete workspace";
      if (axios.isAxiosError(err)) {
        message = err.response?.data.message;
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

  if (isWorkspaceLoading)
    return <Loader2 className="mx-auto mt-20 animate-spin text-violet-600" />;

  const workspace = workspaceData?.details?.workspace;
  const members = membersData?.details ?? [];

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back to Workspace
        </button>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase text-zinc-400">
                Workspace Name
              </Label>
              <Input name="name" defaultValue={workspace?.name} required />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase text-zinc-400">
                Description
              </Label>
              <Textarea
                name="description"
                defaultValue={workspace?.description || ""}
                rows={4}
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

      <Card className="border-zinc-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Member Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isMembersLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {members.map((m) => {
                const currentRoleId = selectedRoles[m.user.id] || m.role.name;
                const hasChanged = currentRoleId !== m.role.name;

                return (
                  <div
                    key={m.user.id}
                    className="p-4 flex items-center justify-between hover:bg-zinc-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600 uppercase border border-violet-200">
                        {(m.user.name || m.user.email).charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-700 leading-none">
                          {m.user.name || "Anonymous User"}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                          {m.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Select
                          defaultValue={m.role.name}
                          onValueChange={(val) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [m.user.id]: val,
                            }))
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-[11px] font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OWNER">Owner</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        size="sm"
                        disabled={!hasChanged || roleMutation.isPending}
                        onClick={() =>
                          roleMutation.mutate({
                            memberId: m.user.id,
                            roleId: currentRoleId,
                          })
                        }
                        className={`h-8 text-[10px] font-bold uppercase tracking-wider px-3 transition-all ${
                          hasChanged
                            ? "bg-violet-600 hover:bg-violet-700 shadow-sm"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        }`}
                      >
                        {roleMutation.isPending &&
                        roleMutation.variables?.memberId === m.user.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Update Role"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/20">
        <CardHeader>
          <CardTitle className="text-lg text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600 leading-relaxed">
            Deleting this workspace will permanently remove all associated
            projects, tasks, and data. This action cannot be undone.
          </p>
          {!isDeleting ? (
            <Button
              variant="destructive"
              className="h-9 text-xs font-bold shadow-sm"
              onClick={() => setIsDeleting(true)}
            >
              Delete Workspace
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="h-9 text-xs font-bold"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                ) : null}
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
