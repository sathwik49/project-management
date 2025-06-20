import { prisma } from "../config/db";
import { AppError, BadRequestError, NotFoundError } from "../utils/error";

export const createProjectService = async (
  workspaceId: string,
  userId: string,
  name: string,
  description?: string,
  image?: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundError("Workspace Not Found.Check WorkspaceId");
  }

  const isExistingProject = await prisma.project.findFirst({
    where: {
      name: name,
      workspaceId: workspaceId,
    },
  });
  if (isExistingProject) {
    throw new BadRequestError("Project name must be unique");
  }

  const project = await prisma.project.create({
    data: {
      name: name,
      description: description,
      image: image,
      workspaceId: workspaceId,
      createdById: userId,
    },
  });

  return project;
};

export const getAllProjectsInWorkspaceService = async (
  workspaceId: string,
  userId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalCount = await prisma.project.count({
    where: {
      workspaceId: workspaceId,
    },
  });
  const skip = (pageNumber - 1) * pageSize;
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
    },
  });

  if (!project) {
    throw new NotFoundError(
      "Project not found or Project doesn't exist in the workspace"
    );
  }

  return project;
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundError(
      "Project not found or Project doesn't exist in the workspace"
    );
  }

  const currentDate = new Date();

  const totalTasks = await prisma.task.count({
    where: {
      projectId: projectId,
    },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      projectId,
      AND: {
        dueDate: {
          lt: currentDate,
        },
        status: {
          not: "DONE",
        },
      },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      workspaceId,
      status: "DONE",
    },
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return analytics;
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  name: string,
  description?: string,
  image?: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundError(
      "Project not found or Project doesn't exist in the workspace"
    );
  }

   const isExistingProject = await prisma.project.findFirst({
    where: {
      name: name,
      workspaceId: workspaceId,
    },
  });
  if (isExistingProject) {
    throw new BadRequestError("Project name must be unique");
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: name,
      description: description || null,
      image: image || null,
    },
  });

  return updatedProject;
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundError(
      "Project not found or Project doesn't exist in the workspace"
    );
  }

  await prisma.task.deleteMany({
    where:{projectId}
  })

  await prisma.project.delete({
    where:{id:projectId}
  })
};
