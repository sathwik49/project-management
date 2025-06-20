import { prisma } from "../config/db";
import { $Enums } from "../generated/prisma";
import {
  TaskPriorityEnum,
  TaskPriorityEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "../utils/enums";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../utils/error";
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
    status: $Enums.TaskStatus;
    priority: $Enums.TaskPriority;
  }
) => {
  const { title, description, dueDate, assignedTo, status, priority } = body;

  const project = await prisma.project.findFirst({ where: { id: projectId } });
  if (!project || project.workspaceId.toString() !== workspaceId) {
    throw new NotFoundError(
      "Project not found or  doesn't exist belong to this workspace"
    );
  }

  if (assignedTo) {
    const isAssignedUserMember = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: assignedTo,
      },
    });
    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace");
    }
  }
  const isExistingTask = await prisma.task.findFirst({
    where: {
      title,
      projectId,
    },
  });
  if (isExistingTask) {
    throw new BadRequestError("Choose a unique task name");
  }
  const date = new Date(dueDate);

  const task = await prisma.task.create({
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

  return task;
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
    status: $Enums.TaskStatus;
    priority: $Enums.TaskPriority;
  }
) => {
  const { title, description, dueDate, assignedTo, status, priority } = body;

  const project = await prisma.project.findFirst({ where: { id: projectId } });
  if (!project || project.workspaceId.toString() !== workspaceId) {
    throw new NotFoundError(
      "Project not found or  doesn't exist belong to this workspace"
    );
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId },
  });
  if (!task || task.projectId.toString() !== projectId) {
    throw new NotFoundError("Task not found or doesn't belong to this Project");
  }

  if (assignedTo) {
    const isAssignedUserMember = await prisma.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: assignedTo,
      },
    });
    if (!isAssignedUserMember) {
      throw new UnAuthorizedError(
        "Assigned user is not a member of this workspace"
      );
    }
  }
  //   const isExistingTask = await prisma.task.findFirst({
  //     where: {
  //       title,
  //       projectId,
  //     },
  //   });
  //   if (isExistingTask) {
  //     throw new BadRequestError("Choose a unique task name");
  //   }
  const date = new Date(dueDate);
  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title,
      description,
      dueDate: date,
      assignedToId: assignedTo,
      status,
      priority,
    },
  });
  return updatedTask;
};

export const getAllTasksInWorkspaceService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  paginationFilter: {
    pageNumber: number;
    pageSize: number;
  }
) => {
  const workspace = await prisma.workspace.findFirst({where:{id:workspaceId}})
  if(!workspace){
    throw new NotFoundError("Workspace not found")
  }

  const query: any = {
    workspaceId,
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.status &&
      filters.status.length > 0 && {
        status: {
          in: filters.status,
        },
      }),
    ...(filters.priority &&
      filters.priority.length > 0 && {
        priority: {
          in: filters.priority,
        },
      }),
    ...(filters.assignedTo &&
      filters.assignedTo.length > 0 && {
        assignedToId: {
          in: filters.assignedTo,
        },
      }),
    ...(filters.keyword && {
      title: {
        contains: filters.keyword,
        mode: "insensitive",
      },
    }),
    ...(filters.dueDate && {
      dueDate: {
        equals: new Date(filters.dueDate),
      },
    }),
  };

  const { pageNumber, pageSize } = paginationFilter;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where: query,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include:{
        assignedTo:{
          select:{
            id:true,
            name:true,
            profilePicture:true
          }
        }
      }
    }),
    prisma.task.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  taskId: string,
  projectId: string,
  workspaceId: string
) => {
  const project = await prisma.project.findFirst({
    where: { id:projectId },
  });
  if (!project || project.workspaceId.toString() !== workspaceId) {
    throw new NotFoundError(
      "Project not found or  doesn't exist belong to this workspace"
    );
  }

  const task = await prisma.task.findFirst({
    where:{id:taskId},
    include:{
      assignedTo:{
        select:{
          name:true,
          id:true,
          profilePicture:true
        }
      }
    }
  })

  if(!task){
    throw new NotFoundError("Task not found")
  }
  return task;
};

export const deleteTaskByIdService = async (
  workspaceId:string,
  taskId:string
) => {
  const task = await prisma.task.findFirst({
    where:{
      id:taskId,
      workspaceId
    }
  })

  if(!task){
    throw new NotFoundError("Task not found or doesn't belong to this workspace")
  }

  await prisma.task.delete({
    where:{
      id:taskId,
      workspaceId
    }
  })

  return;
}
