import { Router } from "express";
import { createProjectController, deleteProjectController, getAllProjectsInWorkspaceController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController, updateProjectController } from "../controllers/project.controller";

const projectRouter = Router()

projectRouter.post("/workspace/:workspaceId/create",createProjectController)
projectRouter.get("/workspace/:workspaceId/all",getAllProjectsInWorkspaceController)
projectRouter.get("/:projectId/workspace/:workspaceId",getProjectByIdAndWorkspaceIdController)
projectRouter.get("/:projectId/workspace/:workspaceId/analytics",getProjectAnalyticsController)
projectRouter.put("/:projectId/workspace/:workspaceId/update",updateProjectController)
projectRouter.delete("/:projectId/workspace/:workspaceId/delete",deleteProjectController)

export default projectRouter