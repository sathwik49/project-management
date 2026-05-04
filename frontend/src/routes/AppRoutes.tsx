import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/auth/SignUp";
import SignIn from "../pages/auth/SignIn";
import AuthBase from "../pages/auth/AuthLayout";
import VerifyEmail from "../pages/auth/VerifyEmail";
import NotFound from "../pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import ProtectedPage from "@/pages/ProtectedPage";
import WorkspaceList from "@/pages/workspace/WorkspaceList";
import WorkspaceDetail from "@/pages/workspace/WorkspaceDetail";
import WorkspaceSettings from "@/components/workspace/WorkspaceSettings";
import JoinWorkspace from "@/pages/workspace/JoinWorkspace";
import ProjectList from "@/pages/project/ProjectList";
import ProjectDetail from "@/pages/project/ProjectDetail";
import ProjectSettings from "@/pages/project/ProjectSettings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route element={<AuthBase />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="verify-email/:token" element={<VerifyEmail />} />
      </Route>
      <Route element={<ProtectedPage />}>
        <Route index path="dashboard" element={<Dashboard />} />
        <Route path="workspaces" element={<WorkspaceList />} />
        <Route path="workspaces/:workspaceId" element={<WorkspaceDetail />} />
        <Route
          path="workspaces/:workspaceId/settings"
          element={<WorkspaceSettings />}
        />

        <Route
          path="workspaces/:workspaceId/projects"
          element={<ProjectList />}
        />
        <Route
          path="workspaces/:workspaceId/projects/:projectId"
          element={<ProjectDetail />}
        />
        <Route
          path="workspaces/:workspaceId/projects/:projectId/settings"
          element={<ProjectSettings />}
        />
      </Route>
      <Route path="workspace/join/:invite" element={<JoinWorkspace />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
