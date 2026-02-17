import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUserWorkspaces, switchCurrentWorkspace } from "@/api/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface WorkspaceSwitcherProps {
  currentWorkspaceId?: string;
  currentWorkspaceName?: string;
}

export default function WorkspaceSwitcher({
  currentWorkspaceId,
  currentWorkspaceName,
}: WorkspaceSwitcherProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllUserWorkspaces,
    staleTime: 5 * 60 * 1000,
  });

  const workspaces = data?.details ?? [];

  const switchMutation = useMutation({
    mutationFn: switchCurrentWorkspace,
    onSuccess: () => {
      toast.success("Workspace switched");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => {
      toast.error("Failed to switch workspace");
    },
  });

  const handleSwitch = (wsId: string) => {
    if (wsId === currentWorkspaceId) return;
    switchMutation.mutate(wsId);
  };

  if (isLoading) {
    return <span className="text-gray-500">Loading workspaces...</span>;
  }

  if (isError || workspaces.length === 0) {
    return <span className="text-gray-500">No workspaces</span>;
  }

  if (!currentWorkspaceName) {
    return <span className="text-gray-500">No workspace selected</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mt-1">
        <button className="flex items-center gap-1 text-lg font-medium text-gray-800 hover:text-violet-700 focus:outline-none cursor-pointer">
          {currentWorkspaceName}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 max-h-80 overflow-y-auto"
      >
        {workspaces.map((ws: any) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => handleSwitch(ws.id)}
            className={`cursor-pointer ${ws.id === currentWorkspaceId ? "bg-violet-50 font-medium" : ""}`}
          >
            {ws.name}
            {ws.id === currentWorkspaceId && "*"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
