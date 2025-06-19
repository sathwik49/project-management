import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthError, NotFoundError, ValidationError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project";
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
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const data = createProjectSchema.safeParse(req.body);
    if (!data.success) {
      throw new ZodError(data.error.errors);
    }
    const { name, description, image } = data.data;

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.CREATE_PROJECT]);

    const project = await createProjectService(
      workspaceId,
      userId,
      name,
      description,
      image
    );

    return res.status(200).json({
      message: "Project Created in workspace successfully",
      project,
    });
  }
);

export const getAllProjectsInWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }
    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const pageSize = parseInt(req.params.pageSize as string) || 10;
    const pageNumber = parseInt(req.params.pageNumber as string) || 1;

    const { projects, totalCount, totalPages, skip } =
      await getAllProjectsInWorkspaceService(
        workspaceId,
        userId,
        pageSize,
        pageNumber
      );

    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
      pagination: {
        totalCount,
        totalPages,
        pageSize,
        pageNumber,
        skip,
        limit: pageSize,
      },
    });
  }
);

export const getProjectByIdAndWorkspaceIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const project = await getProjectByIdAndWorkspaceIdService(
      workspaceId,
      projectId
    );

    return res.status(200).json({
      message: "Project fetched successfully",
      project: project,
    });
  }
);

export const getProjectAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const projectAnalytics = await getProjectAnalyticsService(
      workspaceId,
      projectId
    );

    return res.status(200).json({
      message: "Project analytics fetched successfully",
      analytics: projectAnalytics,
    });
  }
);

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const data = updateProjectSchema.safeParse(req.body);
    if (!data.success) {
      throw new ZodError(data.error.errors);
    }
    const { name, description, image } = data.data;

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.EDIT_PROJECT]);

    const project = await updateProjectService(
      workspaceId,
      projectId,
      name,
      description,
      image
    );

    return res.status(200).json({
      message: "Updated Project successfully",
      project,
    });
  }
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError();
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.DELETE_PROJECT]);

    await deleteProjectService(workspaceId,projectId)

    return res.status(200).json({
        message:"Project deleted Successfully"
    })
  }
);
