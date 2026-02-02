import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/auth"; // or wherever you put it
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, FolderKanban, ListTodo, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "@/components/logout";

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
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50">
        <p className="text-lg text-red-600">
          Session expired or error. Please sign in again.
        </p>
        <Link to="/sign-in">
          <Button variant="outline" className="cursor-pointer">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const user = data.details;
  const workspace = user.currentWorkspace;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-1.5">
          <Link to="/" className="text-xl font-semibold text-violet-600">
            ProManSys
          </Link>
          {workspace && (
            <>
              <span className="text-violet-600">/</span>
              <span className="text-lg font-medium text-gray-800">
                {workspace.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profilePicture ?? undefined}
              alt={user.name}
            />
            <AvatarFallback className="bg-violet-100 text-violet-700">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Logout />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-gray-600 mt-1">
            {workspace
              ? `Working in ${workspace.name}`
              : "Select or create a workspace to get started"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-violet-600" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-gray-500 mt-1">4 active</p>
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
              <div className="text-3xl font-bold">28</div>
              <p className="text-sm text-gray-500 mt-1">7 due soon</p>
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
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-gray-500 mt-1">Members</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="hover:border-violet-300 transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Project {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    In progress • Due in 2 weeks
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
