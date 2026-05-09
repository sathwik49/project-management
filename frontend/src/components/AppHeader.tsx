import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "@/components/logout";
import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutDashboard, Menu, X } from "lucide-react";
import type { currentUserType } from "@/api/types";
import { useState } from "react";

interface AppHeaderProps {
  user: currentUserType;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const workspace = user.currentWorkspace;
  const isActive = (path: string) => location.pathname.startsWith(path);

  const showSwitcher =
    location.pathname === "/dashboard" ||
    location.pathname.includes("/workspaces") ||
    location.pathname.includes("/projects");

  return (
    <>
      <header className="bg-white border-b border-zinc-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-base font-bold text-violet-600 mr-2 sm:mr-3"
          >
            ProManSys
          </Link>
          <nav className="hidden sm:flex items-center gap-0.5">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-violet-50 text-violet-700"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <Link
              to="/workspaces"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/workspaces")
                  ? "bg-violet-50 text-violet-700"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Workspaces
            </Link>
          </nav>

          {showSwitcher && (
            <div className="hidden sm:flex items-center">
              <div className="w-px h-5 bg-zinc-200 mx-1" />
              {workspace ? (
                <WorkspaceSwitcher
                  currentWorkspaceId={workspace.id}
                  currentWorkspaceName={workspace.name}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-500 hover:text-violet-600 gap-1.5"
                  onClick={() => navigate("/workspaces")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Select Workspace
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm text-zinc-700 hidden sm:block">
            {user.name}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profilePicture ?? undefined}
              alt={user.name}
            />
            <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Logout />
          <button
            className="sm:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-50"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="sm:hidden bg-white border-b border-zinc-200 px-4 py-3 space-y-1 sticky top-[57px] z-40">
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-violet-50 text-violet-700"
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/workspaces"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/workspaces")
                ? "bg-violet-50 text-violet-700"
                : "text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Workspaces
          </Link>

          {showSwitcher && (
            <div className="pt-1 border-t border-zinc-100 mt-1">
              {workspace ? (
                <WorkspaceSwitcher
                  currentWorkspaceId={workspace.id}
                  currentWorkspaceName={workspace.name}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-zinc-500 gap-1.5"
                  onClick={() => {
                    navigate("/workspaces");
                    setMobileOpen(false);
                  }}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Select Workspace
                </Button>
              )}
            </div>
          )}

          <div className="pt-1 border-t border-zinc-100 mt-1">
            <p className="px-3 py-1 text-sm font-medium text-zinc-700">
              {user.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
