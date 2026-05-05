import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  getWorkspaceById,
  getWorkspaceAnalytics,
  getWorkspaceMembers,
  createProject,
  getProjectsInWorkspace,
} from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  ArrowLeft,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  Users,
  Copy,
  Check,
  FolderKanban,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import { QUERY_KEYS } from "@/lib/endpoints";
import toast from "react-hot-toast";
import { Pagination } from "@/components/Pagination";

export default function WorkspaceDetail() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
  } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.DETAIL(workspaceId!),
    queryFn: () => getWorkspaceById(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId!), page],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId as string, {
        pageNumber: page,
        pageSize: 4,
      }),
    enabled: Boolean(workspaceId),
  });

  const { data: analyticsData } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.ANALYTICS(workspaceId!),
    queryFn: () => getWorkspaceAnalytics(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  const { data: membersData } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.MEMBERS(workspaceId!),
    queryFn: () => getWorkspaceMembers(workspaceId as string),
    enabled: Boolean(workspaceId),
  });
  const workspace = workspaceData?.details?.workspace;
  const members = membersData?.details ?? [];
  const analytics = analyticsData?.details;

  const projects = projectsData?.details ?? [];
  const pagination = projectsData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const mutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createProject(workspaceId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT.ALL(workspaceId!),
      });
      setIsOpen(false);
      toast.success("Project created");
    },
    onError: () => toast.error("Failed to create project"),
  });

  if (!isWorkspaceLoading && (isWorkspaceError || !workspaceData?.details)) {
    return <Navigate to="/404" replace />;
  }

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    if (!name.trim()) return;
    mutation.mutate({ name, description: description || undefined });
  };

  const handleCopyInvite = () => {
    if (!workspace?.inviteCode) return;
    const link = `${window.location.origin}/workspace/join/${workspace.inviteCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isWorkspaceLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!workspace) return null;

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        <button
          onClick={() => navigate("/workspaces")}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Workspaces
        </button>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-violet-100">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
                {workspace.name}
              </h1>
              <p className="text-[11px] text-zinc-500 mt-1">
                {workspace.description || "Active Workspace"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/workspaces/${workspaceId}/settings`)}
              className="h-8 border-zinc-200 text-zinc-600 font-bold text-[11px] px-3 hover:bg-zinc-50"
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Settings
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="h-8 bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] px-4">
                  <Plus className="h-3 w-3 mr-1" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 pt-4" onSubmit={handleCreate}>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-zinc-400">
                      Project Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-zinc-400">
                      Project Description
                    </label>
                    <input
                      name="description"
                      required
                      className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-violet-600"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Tasks",
              val: analytics?.totalTasks,
              icon: ListTodo,
              col: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Overdue",
              val: analytics?.overdueTasks,
              icon: AlertTriangle,
              col: "text-rose-600",
              bg: "bg-rose-50",
            },
            {
              label: "Done",
              val: analytics?.completedTasks,
              icon: CheckCircle2,
              col: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-sm"
            >
              <div
                className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}
              >
                <s.icon className={`h-4 w-4 ${s.col}`} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider leading-none">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-zinc-900 mt-0.5 leading-none">
                  {s.val ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <FolderKanban className="h-3 w-3 text-violet-500" />
                  Active Projects
                </h2>
                {projects.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(`/workspaces/${workspaceId}/projects`)
                    }
                    className="h-7 text-[10px] font-bold text-zinc-400 hover:text-violet-600 uppercase tracking-tighter"
                  >
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>

              {isProjectsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-14 bg-zinc-100 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="border border-dashed border-zinc-200 rounded-xl py-8 text-center bg-white">
                  <p className="text-xs text-zinc-400">No projects found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white border border-zinc-200 rounded-lg p-3 flex items-center justify-between hover:border-violet-300 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-50 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-800">
                            {p.name}
                          </h3>
                          <p className="text-[10px] text-zinc-400 line-clamp-1">
                            {p.description || "Internal Project"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/workspaces/${workspaceId}/projects/${p.id}`,
                          )
                        }
                        className="h-8 text-[11px] font-bold text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        Project Details
                        <ArrowUpRight className="h-3 w-3 ml-1.5" />
                      </Button>
                    </div>
                  ))}

                  <Pagination
                    page={page}
                    total={totalPages}
                    onPageChange={setPage}
                    isLoading={isProjectsLoading}
                  />
                </div>
              )}
            </div>

            <Card className="border-zinc-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-zinc-50/40 border-b border-zinc-100 py-1.5 px-3">
                <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Users className="h-2.5 w-2.5 text-violet-500" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-50">
                  {members.map((m) => (
                    <div
                      key={m.user.id}
                      className="flex items-center justify-between py-2 px-3 hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[8px] shrink-0">
                          {(m.user.name || m.user.email)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <p className="text-[11px] font-medium text-zinc-600 truncate max-w-35">
                          {m.user.email}
                        </p>
                      </div>
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 uppercase tracking-tight">
                        {m.role.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-none shadow-md bg-violet-600">
              <CardContent className="p-5 text-white">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                  Invite Link
                </p>
                <div className="mt-2 bg-white/10 rounded p-2 flex items-center justify-between border border-white/10">
                  <code className="text-[10px] font-mono font-bold truncate mr-2">
                    {workspace.inviteCode}
                  </code>
                  <button
                    onClick={handleCopyInvite}
                    className="hover:text-white/70 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] mt-3 opacity-80 leading-tight">
                  Share this link with other users to grant access to this
                  workspace.
                </p>
                <Button
                  onClick={handleCopyInvite}
                  className="w-full mt-4 bg-white text-violet-600 hover:bg-zinc-50 font-bold text-[10px] h-8 shadow-sm"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
