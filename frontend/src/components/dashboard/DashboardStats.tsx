import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalytics, getWorkspaceMembers } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ListTodo, Users } from "lucide-react";

type DashboardStatsProps = {
  workspaceId: string | null;
};

export default function DashboardStats({ workspaceId }: DashboardStatsProps) {
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

  const analytics = analyticsData?.details;
  const members = membersData?.details ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-violet-600" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">-</div>
          <p className="text-sm text-gray-500 mt-1">Workspace projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-violet-600" />
            Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {analytics ? analytics.totalTasks : "-"}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {analytics ? `${analytics.overdueTasks} overdue` : "Tasks overview"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{members.length || "-"}</div>
          <p className="text-sm text-gray-500 mt-1">Members</p>
        </CardContent>
      </Card>
    </div>
  );
}
