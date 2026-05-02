import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getUserWorkspacesController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  switchCurrentWorkspaceController,
  updateWorkspaceByIdController,
} from "../controllers/workspace.controller";

const workspaceRouter = Router();

workspaceRouter.post("/", createWorkspaceController);
workspaceRouter.get("/", getUserWorkspacesController);
workspaceRouter.get("/:workspaceId", getWorkspaceByIdController);

workspaceRouter.get("/:workspaceId/members", getWorkspaceMembersController);
workspaceRouter.get("/:workspaceId/analytics", getWorkspaceAnalyticsController);

workspaceRouter.patch("/:workspaceId", updateWorkspaceByIdController);
workspaceRouter.delete("/:workspaceId", deleteWorkspaceByIdController);

workspaceRouter.patch("/switch", switchCurrentWorkspaceController);
workspaceRouter.patch(
  "/:workspaceId/member-role",
  changeWorkspaceMemberRoleController,
);

export default workspaceRouter;
