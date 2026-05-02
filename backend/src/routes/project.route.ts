import { Router } from "express";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsInWorkspaceController,
  getProjectAnalyticsController,
  getProjectByIdAndWorkspaceIdController,
  updateProjectController,
} from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.post("/workspace/:workspaceId/projects", createProjectController);

projectRouter.get(
  "/workspace/:workspaceId/projects",
  getAllProjectsInWorkspaceController,
);

projectRouter.get(
  "/workspace/:workspaceId/projects/:projectId",
  getProjectByIdAndWorkspaceIdController,
);

projectRouter.get(
  "/workspace/:workspaceId/projects/:projectId/analytics",
  getProjectAnalyticsController,
);

projectRouter.patch(
  "/workspace/:workspaceId/projects/:projectId",
  updateProjectController,
);

projectRouter.delete(
  "/workspace/:workspaceId/projects/:projectId",
  deleteProjectController,
);

export default projectRouter;
