import { prisma } from "../config/db";
import { BadRequestError, NotFoundError } from "../utils/error";

export const createProjectService = async (
  workspaceId: string,
  userId: string,
  name: string,
  description?: string,
  image?: string,
) => {
  const exists = await prisma.project.findFirst({
    where: { name, workspaceId },
  });

  if (exists) throw new BadRequestError("Project name must be unique");

  return prisma.project.create({
    data: {
      name,
      description,
      image,
      workspaceId,
      createdById: userId,
    },
  });
};

export const getAllProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number,
) => {
  const totalCount = await prisma.project.count({
    where: { workspaceId },
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await prisma.project.findMany({
    where: { workspaceId },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
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

  return {
    projects,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });

  if (!project) throw new NotFoundError("Project not found");

  return project;
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });

  if (!project) throw new NotFoundError("Project not found");

  const now = new Date();

  const totalTasks = await prisma.task.count({
    where: { projectId },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      projectId,
      dueDate: { lt: now },
      status: { not: "DONE" },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: "DONE",
    },
  });

  return { totalTasks, overdueTasks, completedTasks };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  name: string,
  description?: string,
  image?: string,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });

  if (!project) throw new NotFoundError("Project not found");

  const exists = await prisma.project.findFirst({
    where: {
      name,
      workspaceId,
      NOT: { id: projectId },
    },
  });

  if (exists) throw new BadRequestError("Project name must be unique");

  return prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description: description ?? null,
      image: image ?? null,
    },
  });
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string,
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });

  if (!project) throw new NotFoundError("Project not found");

  await prisma.task.deleteMany({ where: { projectId } });

  await prisma.project.delete({
    where: { id: projectId },
  });
};
