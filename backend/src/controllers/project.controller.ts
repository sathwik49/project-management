import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthError, ValidationError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation";
import { ZodError } from "zod";
import {
  createProjectService,
  deleteProjectService,
  getAllProjectsInWorkspaceService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  updateProjectService,
} from "../services/project.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { ProjectPermission } from "../utils/enums";

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");

    const data = createProjectSchema.safeParse(req.body);
    if (!data.success) throw new ZodError(data.error.errors);

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.CREATE_PROJECT]);

    const project = await createProjectService(
      workspaceId,
      userId,
      data.data.name,
      data.data.description,
      data.data.image,
    );

    return res.status(200).json({
      success: true,
      message: "Project created",
      details: project,
    });
  },
);

export const getAllProjectsInWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const workspaceId = req.params.workspaceId as string;
    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;

    const result = await getAllProjectsInWorkspaceService(
      workspaceId,
      pageSize,
      pageNumber,
    );

    return res.status(200).json({
      success: true,
      message: "Projects fetched",
      details: result.projects,
      pagination: {
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        pageSize,
        pageNumber,
      },
    });
  },
);

export const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, projectId } = req.params as {
      workspaceId: string;
      projectId: string;
    };
    if (!workspaceId || !projectId) {
      throw new ValidationError("Invalid params");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const project = await getProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId,
    );

    return res.status(200).json({
      success: true,
      message: "Project fetched",
      details: project,
    });
  },
);

export const getProjectAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, projectId } = req.params as {
      workspaceId: string;
      projectId: string;
    };
    if (!workspaceId || !projectId) {
      throw new ValidationError("Invalid params");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const analytics = await getProjectAnalyticsService(workspaceId, projectId);

    return res.status(200).json({
      success: true,
      message: "Analytics fetched",
      details: analytics,
    });
  },
);

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, projectId } = req.params as {
      workspaceId: string;
      projectId: string;
    };
    if (!workspaceId || !projectId) {
      throw new ValidationError("Invalid params");
    }

    const data = updateProjectSchema.safeParse(req.body);
    if (!data.success) throw new ZodError(data.error.errors);

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.EDIT_PROJECT]);

    const project = await updateProjectService(
      workspaceId,
      projectId,
      data.data.name,
      data.data.description,
      data.data.image,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated",
      details: project,
    });
  },
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, projectId } = req.params as {
      workspaceId: string;
      projectId: string;
    };
    if (!workspaceId || !projectId) {
      throw new ValidationError("Invalid params");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.DELETE_PROJECT]);

    await deleteProjectService(workspaceId, projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted",
      details: null,
    });
  },
);
