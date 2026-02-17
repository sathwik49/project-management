import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectsInWorkspace } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectList() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () =>
      getProjectsInWorkspace(workspaceId as string, {
        pageNumber: 1,
        pageSize: 20,
      }),
    enabled: Boolean(workspaceId),
  });

  const projects = data?.details?.projects ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-600 mt-1">
              All projects in this workspace.
            </p>
          </div>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() =>
              navigate(`/workspaces/${workspaceId}/projects/create`)
            }
          >
            New project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Loading projects...</CardTitle>
              </CardHeader>
            </Card>
          )}

          {!isLoading && projects.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No projects yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Create a project to organize your work.
                </p>
              </CardContent>
            </Card>
          )}

          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:border-violet-300 transition-colors"
              onClick={() =>
                navigate(`/workspaces/${workspaceId}/projects/${project.id}`)
              }
            >
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

