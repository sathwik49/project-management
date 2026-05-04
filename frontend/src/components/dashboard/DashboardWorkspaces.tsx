import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { getAllUserWorkspaces } from "@/api/api";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/lib/endpoints";
import CreateWorkspaceDialog from "../workspace/CreateWorkspaceDialog";

export default function DashboardWorkspaces() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.ALL,
    queryFn: getAllUserWorkspaces,
  });

  const workspaces = (data?.details ?? []).slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Your spaces
        </p>
        <CreateWorkspaceDialog />
      </div>

      <div className="space-y-0.5">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-zinc-100 animate-pulse rounded-md"
            />
          ))
        ) : workspaces.length === 0 ? (
          <div className="text-center py-5 px-4 border border-dashed border-zinc-200 rounded-lg">
            <p className="text-xs text-zinc-400 mb-2">No workspaces yet</p>
            <CreateWorkspaceDialog triggerLabel="Create your first" />
          </div>
        ) : (
          <>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => navigate(`/workspaces/${workspace.id}`)}
                className="w-full group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-700 group-hover:text-violet-600 transition-colors truncate">
                      {workspace.name}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {workspace.description
                        ? workspace.description.slice(0, 30) +
                          (workspace.description.length > 30 ? "…" : "")
                        : "No description"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-violet-400 shrink-0 transition-all group-hover:translate-x-0.5" />
              </button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-xs text-zinc-400 hover:text-violet-600 mt-1 gap-2 h-8 cursor-pointer"
              onClick={() => navigate("/workspaces")}
            >
              <LayoutGrid className="h-3 w-3" />
              View all workspaces
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
