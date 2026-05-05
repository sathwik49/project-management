import { prisma } from "../config/db";
import { $Enums } from "../generated/prisma";
import { TaskPriorityEnum, TaskStatusEnum } from "../utils/enums";
import { BadRequestError, NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";

export const createTaskService = async (
  projectId: string,
  workspaceId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    dueDate: string;
    assignedTo?: string;
    status?: $Enums.TaskStatus;
    priority?: $Enums.TaskPriority;
  },
) => {
  const { title, description, dueDate, assignedTo, status, priority } = body;

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });

  if (!project) {
    throw new NotFoundError("Project not found in workspace");
  }

  if (assignedTo) {
    const member = await prisma.member.findFirst({
      where: { workspaceId, userId: assignedTo },
    });

    if (!member) {
      throw new BadRequestError("Assigned user is not a workspace member");
    }
  }

  const existingTask = await prisma.task.findFirst({
    where: { title, projectId },
  });

  if (existingTask) {
    throw new BadRequestError("Task title must be unique in project");
  }

  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    throw new BadRequestError("Invalid due date");
  }

  return await prisma.task.create({
    data: {
      title,
      description,
      taskCode: genUUid(6),
      dueDate: date,
      projectId,
      workspaceId,
      assignedToId: assignedTo || userId,
      createdById: userId,
      status: status || TaskStatusEnum.TODO,
      priority: priority || TaskPriorityEnum.MEDIUM,
    },
  });
};

export const updateTaskService = async (
  taskId: string,
  projectId: string,
  workspaceId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    dueDate: string;
    assignedTo?: string;
    status?: $Enums.TaskStatus;
    priority?: $Enums.TaskPriority;
  },
) => {
  const { title, description, dueDate, assignedTo, status, priority } = body;

  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId, workspaceId },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (assignedTo) {
    const member = await prisma.member.findFirst({
      where: { workspaceId, userId: assignedTo },
    });

    if (!member) {
      throw new BadRequestError("Assigned user is not a workspace member");
    }
  }

  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    throw new BadRequestError("Invalid due date");
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description: description || null,
      dueDate: date,
      assignedToId: assignedTo ?? task.assignedToId,
      status,
      priority,
    },
  });
};

export const getAllTasksInWorkspaceService = async (
  workspaceId: string,
  filters: any,
  pagination: { pageNumber: number; pageSize: number },
  search?: string,
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId },
  });

  if (!workspace) throw new NotFoundError("Workspace not found");

  const query: any = {
    workspaceId,
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.status && { status: { in: filters.status } }),
    ...(filters.priority && { priority: { in: filters.priority } }),
    ...(filters.assignedTo && { assignedToId: { in: filters.assignedTo } }),
    ...(filters.keyword && {
      title: { contains: filters.keyword, mode: "insensitive" },
    }),
    ...(filters.dueDate && {
      dueDate: { equals: new Date(filters.dueDate) },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const skip = (pagination.pageNumber - 1) * pagination.pageSize;

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where: query,
      skip,
      take: pagination.pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, profilePicture: true },
        },
        createdBy: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
    }),
    prisma.task.count({ where: query }),
  ]);

  return {
    tasks,
    pagination: {
      ...pagination,
      totalCount,
      totalPages: Math.ceil(totalCount / pagination.pageSize),
    },
  };
};

export const getTaskByIdService = async (
  taskId: string,
  projectId: string,
  workspaceId: string,
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId, workspaceId },
    include: {
      assignedTo: {
        select: { id: true, name: true, profilePicture: true },
      },
      createdBy: {
        select: { id: true, name: true, profilePicture: true },
      },
    },
  });

  if (!task) throw new NotFoundError("Task not found");

  return task;
};

export const deleteTaskByIdService = async (
  workspaceId: string,
  taskId: string,
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, workspaceId },
  });

  if (!task) {
    throw new NotFoundError("Task not found in workspace");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};
