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
import CreateWorkspace from "@/pages/workspace/CreateWorkspace";
import WorkspaceDetail from "@/pages/workspace/WorkspaceDetail";
import JoinWorkspace from "@/pages/workspace/JoinWorkspace";
import ProjectList from "@/pages/project/ProjectList";
import ProjectDetail from "@/pages/project/ProjectDetail";
import CreateProject from "@/pages/project/CreateProject";

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
        <Route path="workspaces/create" element={<CreateWorkspace />} />
        <Route path="workspaces/:workspaceId" element={<WorkspaceDetail />} />
        <Route path="workspaces/:workspaceId/projects" element={<ProjectList />} />
        <Route
          path="workspaces/:workspaceId/projects/create"
          element={<CreateProject />}
        />
        <Route
          path="workspaces/:workspaceId/projects/:projectId"
          element={<ProjectDetail />}
        />
        <Route path="workspace/join/:invite" element={<JoinWorkspace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
