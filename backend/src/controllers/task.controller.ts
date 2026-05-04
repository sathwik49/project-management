import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { ZodError } from "zod";
import { UserInterface } from "../utils/interfaces";
import { roleGuard } from "../utils/roleGuard";
import { ProjectPermission } from "../utils/enums";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/task.validation";
import { AuthError, ValidationError } from "../utils/error";
import { getMemberRoleInWorkspace } from "../services/member.service";
import {
  createTaskService,
  deleteTaskByIdService,
  getAllTasksInWorkspaceService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { projectId, workspaceId } = req.params as {
      projectId: string;
      workspaceId: string;
    };

    if (!projectId) throw new ValidationError("Invalid ProjectId");
    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");

    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ZodError(validation.error.errors);
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.CREATE_TASK]);

    const task = await createTaskService(
      projectId,
      workspaceId,
      userId,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      details: task,
    });
  },
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { projectId, workspaceId, taskId } = req.params as {
      projectId: string;
      workspaceId: string;
      taskId: string;
    };

    if (!projectId) throw new ValidationError("Invalid ProjectId");
    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");
    if (!taskId) throw new ValidationError("Invalid TaskId");

    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ZodError(validation.error.errors);
    }

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.EDIT_TASK]);

    const task = await updateTaskService(
      taskId,
      projectId,
      workspaceId,
      userId,
      validation.data,
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      details: task,
    });
  },
);

export const getAllTasksInWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId } = req.params as { workspaceId: string };
    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");

    const filters = {
      projectId: req.query.projectId as string | undefined,
      status: req.query.status
        ? (req.query.status as string).split(",")
        : undefined,
      priority: req.query.priority
        ? (req.query.priority as string).split(",")
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string).split(",")
        : undefined,
      keyword: req.query.keyword as string | undefined,
      dueDate: req.query.dueDate as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const result = await getAllTasksInWorkspaceService(
      workspaceId,
      filters,
      pagination,
    );

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      details: result,
    });
  },
);

export const getTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, projectId, taskId } = req.params as {
      workspaceId: string;
      projectId: string;
      taskId: string;
    };

    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");
    if (!projectId) throw new ValidationError("Invalid ProjectId");
    if (!taskId) throw new ValidationError("Invalid TaskId");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.VIEW_ONLY]);

    const task = await getTaskByIdService(taskId, projectId, workspaceId);

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      details: task,
    });
  },
);

export const deleteTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) throw new AuthError();

    const { workspaceId, taskId } = req.params as {
      workspaceId: string;
      taskId: string;
    };

    if (!workspaceId) throw new ValidationError("Invalid WorkspaceId");
    if (!taskId) throw new ValidationError("Invalid TaskId");

    const role = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [ProjectPermission.DELETE_TASK]);

    await deleteTaskByIdService(workspaceId, taskId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      details: null,
    });
  },
);
