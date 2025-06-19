import { Router } from "express";
import { changeWorkspaceMemberRoleController, createWorkspaceController, deleteWorkspaceByIdController, getUserWorkspacesController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController } from "../controllers/workspace.controller";

const workspaceRouter = Router()

workspaceRouter.post("/create/new",createWorkspaceController)
workspaceRouter.get("/all",getUserWorkspacesController)
workspaceRouter.get("/:id",getWorkspaceByIdController)
workspaceRouter.get("/members/:id",getWorkspaceMembersController)
workspaceRouter.get("/analytics/:id",getWorkspaceAnalyticsController)
workspaceRouter.put("/change/member/role/:id",changeWorkspaceMemberRoleController)
workspaceRouter.put("/update/:id",updateWorkspaceByIdController)
workspaceRouter.delete("/delete/:id",deleteWorkspaceByIdController)

export default workspaceRouter;