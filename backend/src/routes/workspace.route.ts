import { Router } from "express";
import { createWorkspaceController, getUserWorkspacesController, getWorkspaceByIdController, getWorkspaceMembersController } from "../controllers/workspace.controller";

const workspaceRouter = Router()

workspaceRouter.post("/create/new",createWorkspaceController)
workspaceRouter.get("/all",getUserWorkspacesController)
workspaceRouter.get("/:id",getWorkspaceByIdController)
workspaceRouter.get("/members/:id",getWorkspaceMembersController)

export default workspaceRouter;