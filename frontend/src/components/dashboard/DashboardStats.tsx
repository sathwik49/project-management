import { useQuery } from "@tanstack/react-query";
import {
  getWorkspaceAnalytics,
  getWorkspaceMembers,
  getProjectsInWorkspace,
} from "@/api/api";
import {
  FolderKanban,
  ListTodo,
  Users,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { QUERY_KEYS } from "@/lib/endpoints";

type DashboardStatsProps = {
  workspaceId: string;
};

export default function DashboardStats({ workspaceId }: DashboardStatsProps) {
  const { data: analyticsData } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.ANALYTICS(workspaceId),
    queryFn: () => getWorkspaceAnalytics(workspaceId),
    enabled: Boolean(workspaceId),
  });

  const { data: membersData } = useQuery({
    queryKey: QUERY_KEYS.WORKSPACE.MEMBERS(workspaceId),
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: Boolean(workspaceId),
  });

  const { data: projectsData } = useQuery({
    queryKey: [...QUERY_KEYS.PROJECT.ALL(workspaceId), "stats"],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId, { pageNumber: 1, pageSize: 1 }),
    enabled: Boolean(workspaceId),
  });

  const analytics = analyticsData?.details;
  const membersCount = membersData?.details?.length ?? 0;
  const projectsCount = (projectsData as any)?.pagination?.totalCount ?? 0;

  const stats = [
    {
      label: "Active Projects",
      value: projectsCount,
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Total projects",
      isAlert: false,
    },
    {
      label: "Total Tasks",
      value: analytics?.totalTasks ?? 0,
      icon: ListTodo,
      color: "text-violet-600",
      bg: "bg-violet-50",
      description:
        (analytics?.overdueTasks ?? 0) > 0
          ? `${analytics!.overdueTasks} overdue`
          : "All on track",
      isAlert: (analytics?.overdueTasks ?? 0) > 0,
    },
    {
      label: "Team Members",
      value: membersCount,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Collaborators",
      isAlert: false,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-zinc-100 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-zinc-900">
                {stat.value}
              </span>
              {stat.label === "Active Projects" && stat.value > 0 && (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {stat.isAlert && (
                <AlertCircle className="h-2.5 w-2.5 text-amber-500 shrink-0" />
              )}
              <p
                className={`text-[10px] ${stat.isAlert ? "text-amber-600" : "text-zinc-400"}`}
              >
                {stat.description}
              </p>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${stat.bg} shrink-0`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
