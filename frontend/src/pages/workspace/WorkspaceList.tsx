import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllUserWorkspaces } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkspaceList() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllUserWorkspaces,
  });

  const workspaces = data?.details ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage the spaces where your team collaborates.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => navigate("/workspaces/create")}
            >
              Create workspace
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/workspace/join/sample-code")}
            >
              Join with code
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Loading workspaces...</CardTitle>
              </CardHeader>
            </Card>
          )}

          {!isLoading && workspaces.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No workspaces yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Create a new workspace or join one with an invite code.
                </p>
              </CardContent>
            </Card>
          )}

          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="cursor-pointer hover:border-violet-300 transition-colors"
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
            >
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {workspace.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

