import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllUserWorkspaces, switchCurrentWorkspace } from "@/api/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/endpoints";

interface WorkspaceSwitcherProps {
  currentWorkspaceId?: string;
  currentWorkspaceName?: string;
}

export default function WorkspaceSwitcher({
  currentWorkspaceId,
  currentWorkspaceName,
}: WorkspaceSwitcherProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.ALL,
    queryFn: () => getAllUserWorkspaces(undefined, undefined, 5),
    staleTime: 5 * 60 * 1000,
  });

  const workspaces = data?.details?.workspaces || [];

  const switchMutation = useMutation({
    mutationFn: switchCurrentWorkspace,
    onSuccess: (_, wsId) => {
      toast.success("Workspace switched");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.CURRENT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKSPACE.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT.ALL(wsId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.ANALYTICS(wsId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKSPACE.MEMBERS(wsId),
      });

      const current = location.pathname;

      if (current === "/dashboard") {
        return;
      } else if (current.includes("/projects")) {
        navigate(`/workspaces/${wsId}/projects`);
      } else {
        navigate(`/workspaces/${wsId}`);
      }
    },
    onError: () => toast.error("Failed to switch workspace"),
  });

  const handleSwitch = (wsId: string) => {
    if (wsId === currentWorkspaceId) return;
    switchMutation.mutate(wsId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 px-2 py-1">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </div>
    );
  }

  if (isError || workspaces.length === 0) {
    return (
      <span className="text-sm text-zinc-400 px-2 italic">No workspaces</span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-violet-200 transition-all focus:outline-none cursor-pointer group">
          <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
            {currentWorkspaceName?.charAt(0) ?? (
              <Building2 className="h-3 w-3" />
            )}
          </div>
          <span className="text-sm font-semibold text-zinc-700 group-hover:text-violet-700 truncate max-w-30">
            {currentWorkspaceName ?? "Select Workspace"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-hover:text-violet-500 transition-colors shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-60 p-2 shadow-xl border-zinc-100"
      >
        <div className="px-2 py-1.5 mb-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Your Workspaces
          </p>
        </div>

        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => handleSwitch(ws.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer mb-0.5 transition-colors ${
              ws.id === currentWorkspaceId
                ? "bg-violet-50 text-violet-700"
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                  ws.id === currentWorkspaceId
                    ? "bg-violet-600 text-white border-transparent"
                    : "bg-white text-zinc-400 border-zinc-200"
                }`}
              >
                {ws.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate max-w-35">
                {ws.name}
              </span>
            </div>
            {ws.id === currentWorkspaceId && (
              <Check className="h-3.5 w-3.5 text-violet-600 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={() => navigate("/workspaces")}
          className="text-xs text-violet-600 font-medium justify-center py-2 cursor-pointer hover:bg-violet-50 rounded-md"
        >
          Manage Workspaces
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
