import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardProjects from "@/components/dashboard/DashboardProjects";
import DashboardWorkspaces from "@/components/dashboard/DashboardWorkspaces";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import { FolderOpen } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import CreateWorkspaceDialog from "@/components/workspace/CreateWorkspaceDialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data } = useAuthUser();
  const user = data?.details;

  if (!user) return null;

  const workspace = user.currentWorkspace;

  return (
    <main className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      <DashboardWelcome userName={user.name} workspaceName={workspace?.name} />

      {workspace ? (
        <>
          <DashboardStats workspaceId={workspace.id} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white border border-zinc-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-zinc-900 truncate">
                    {workspace.name}
                  </h1>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {workspace.description ||
                      "Project management and team collaboration"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs"
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                >
                  View workspace
                </Button>
              </div>

              <DashboardProjects workspaceId={workspace.id} />
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="bg-zinc-900 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <h2 className="text-sm font-semibold text-white mb-1">
                    New Workspace
                  </h2>
                  <p className="text-xs text-zinc-400 mb-4">
                    Create a dedicated space for your next big project.
                  </p>
                  <CreateWorkspaceDialog
                    triggerLabel="Get Started"
                    triggerClassName="w-full bg-white text-zinc-900 hover:bg-zinc-100 text-sm h-8"
                  />
                </div>
                <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-violet-600/20 rounded-full blur-2xl group-hover:bg-violet-600/30 transition-colors" />
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Your Workspaces
                  </p>
                  <button
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer hover:underline hover:underline-offset-1"
                    onClick={() => navigate("/workspaces")}
                  >
                    View all
                  </button>
                </div>
                <DashboardWorkspaces />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl p-16 shadow-sm text-center max-w-lg mx-auto mt-8">
          <div className="w-14 h-14 rounded-xl bg-zinc-50 flex items-center justify-center mx-auto mb-5 border border-zinc-100">
            <FolderOpen size={24} className="text-zinc-300" />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900 mb-2">
            No workspace selected
          </h1>
          <p className="text-sm text-zinc-400 mb-6 max-w-xs mx-auto">
            Select an existing workspace or create a new one to get started.
          </p>
          <Button
            className="bg-violet-600 hover:bg-violet-700 px-8"
            onClick={() => navigate("/workspaces/create")}
          >
            Create workspace
          </Button>
        </div>
      )}
    </main>
  );
}
