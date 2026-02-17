import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectAnalytics, getProjectById } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectDetail() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () => getProjectById(workspaceId as string, projectId as string),
    enabled: Boolean(workspaceId && projectId),
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["projectAnalytics", workspaceId, projectId],
    queryFn: () =>
      getProjectAnalytics(workspaceId as string, projectId as string),
    enabled: Boolean(workspaceId && projectId),
  });

  const project = projectData?.details;
  const analytics = analyticsData?.details;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {isLoading && (
          <div className="text-gray-700">Loading project...</div>
        )}

        {!isLoading && project && (
          <>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                {project.description || "No description"}
              </p>
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
          </>
        )}
      </main>
    </div>
  );
}

