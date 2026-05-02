import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import {
  changeMemberRoleService,
  createWorkspaceService,
  deleteWorkspaceByIdService,
  getUserWorkspacesService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  switchCurrentWorkspaceService,
  updateWorkspaceByIdService,
} from "../services/workspace.service";
import {
  changeMemberRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../validations/workspace.validation";
import { ZodError } from "zod";
import { UserInterface } from "../utils/interfaces";
import { AuthError, BadRequestError } from "../utils/error";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { ProjectPermission } from "../utils/enums";

export const createWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) throw new ZodError(parsed.error.errors);

    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspace = await createWorkspaceService(userId, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Workspace created",
      details: workspace,
    });
  },
);

export const getUserWorkspacesController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaces = await getUserWorkspacesService(userId);

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched",
      details: workspaces,
    });
  },
);

export const getWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const data = await getWorkspaceByIdService(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace fetched",
      details: data,
    });
  },
);

export const getWorkspaceMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const members = await getWorkspaceMembersService(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Members fetched",
      details: members,
    });
  },
);

export const getWorkspaceAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const analytics = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Analytics fetched",
      details: analytics,
    });
  },
);

export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const parsed = changeMemberRoleSchema.safeParse(req.body);
    if (!parsed.success) throw new ZodError(parsed.error.errors);

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.CHANGE_MEMBER_ROLE]);

    const member = await changeMemberRoleService(
      workspaceId,
      parsed.data.memberId,
      parsed.data.roleId,
    );

    return res.status(200).json({
      success: true,
      message: "Role updated",
      details: member,
    });
  },
);

export const updateWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const parsed = updateWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) throw new ZodError(parsed.error.errors);

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.EDIT_WORKSPACE]);

    const workspace = await updateWorkspaceByIdService(
      workspaceId,
      userId,
      parsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Workspace updated",
      details: workspace,
    });
  },
);

export const deleteWorkspaceByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.id;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.DELETE_WORKSPACE]);

    const result = await deleteWorkspaceByIdService(workspaceId, userId);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted",
      details: result,
    });
  },
);

export const switchCurrentWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId } = req.body;
    if (!workspaceId) throw new BadRequestError("Workspace id required");

    const user = await switchCurrentWorkspaceService(userId, workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace switched",
      details: user.currentWorkspaceId,
    });
  },
);
