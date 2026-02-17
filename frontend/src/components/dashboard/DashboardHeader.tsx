import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "@/components/logout";
import type { currentUserType } from "@/api/types";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  user: currentUserType;
  workspace: any;
}

export default function DashboardHeader({
  user,
  workspace,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center justify-center gap-4">
        <Link to="/" className="text-xl font-semibold text-violet-600">
          ProManSys
        </Link>
        {workspace && (
          <WorkspaceSwitcher
            currentWorkspaceId={workspace.id}
            currentWorkspaceName={workspace.name}
          />
        )}
        {!workspace && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = "/workspaces";
            }}
          >
            Choose workspace
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.profilePicture ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-violet-100 text-violet-700">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <Logout />
      </div>
    </header>
  );
}
