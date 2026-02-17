import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardProjects from "@/components/dashboard/DashboardProjects";
import DashboardWorkspaces from "@/components/dashboard/DashboardWorkspaces";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-violet-100/50">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data?.details) {
    navigate("/sign-in", { replace: true });
    return null;
  }

  const user = data.details;
  const workspace = user.currentWorkspace;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} workspace={workspace} />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardWelcome
          userName={user.name}
          workspaceName={workspace?.name}
        />

        {!workspace && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => navigate("/workspaces/create")}
            >
              Create workspace
            </Button>
          </div>
        )}
        <DashboardStats workspaceId={workspace?.id ?? null} />

        <DashboardWorkspaces />

        <DashboardProjects workspaceId={workspace?.id ?? null} />
      </main>
    </div>
  );
}
