import { prisma } from "../config/db";
import { $Enums } from "../generated/prisma";
import { AuthError, BadRequestError, NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";

export const createWorkspaceService = async (
  userId: string,
  data: { name: string; description?: string },
) => {
  const ownerRole = await prisma.role.findFirst({
    where: { name: "OWNER" },
  });

  if (!ownerRole) throw new NotFoundError("Role not found");

  const exists = await prisma.workspace.findFirst({
    where: { name: data.name, ownerId: userId },
  });

  if (exists) throw new BadRequestError("Workspace name must be unique");

  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      description: data.description,
      inviteCode: genUUid(7),
      ownerId: userId,
    },
  });

  await prisma.member.create({
    data: {
      userId,
      workspaceId: workspace.id,
      roleId: ownerRole.name,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { currentWorkspaceId: workspace.id },
  });

  return workspace;
};

export const getUserWorkspacesService = async (userId: string) => {
  const memberships = await prisma.member.findMany({
    where: { userId },
    select: {
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
          inviteCode: true,
          ownerId: true,
        },
      },
    },
  });

  return memberships.map((m) => m.workspace);
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) throw new NotFoundError("Workspace not found");

  const members = await prisma.member.findMany({
    where: { workspaceId },
    include: {
      role: true,
      user: true,
    },
  });

  return { workspace, members };
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  return await prisma.member.findMany({
    where: { workspaceId },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicture: true,
        },
      },
      role: {
        select: {
          name: true,
          permissions: true,
        },
      },
    },
  });
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const now = new Date();

  const [total, overdue, completed] = await Promise.all([
    prisma.task.count({ where: { workspaceId } }),
    prisma.task.count({
      where: {
        workspaceId,
        dueDate: { lt: now },
        status: { not: "DONE" },
      },
    }),
    prisma.task.count({
      where: { workspaceId, status: "DONE" },
    }),
  ]);

  return {
    totalTasks: total,
    overdueTasks: overdue,
    completedTasks: completed,
  };
};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: $Enums.ProjectRole,
) => {
  const member = await prisma.member.findFirst({
    where: { userId: memberId, workspaceId },
  });

  if (!member) throw new NotFoundError("Member not found");

  return await prisma.member.update({
    where: { id: member.id },
    data: { roleId },
  });
};

export const updateWorkspaceByIdService = async (
  workspaceId: string,
  userId: string,
  data: { name?: string; description?: string },
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) throw new NotFoundError("Workspace not found");

  if (data.name && data.name !== workspace.name) {
    const exists = await prisma.workspace.findFirst({
      where: {
        name: data.name,
        ownerId: userId,
        NOT: { id: workspaceId },
      },
    });

    if (exists) throw new BadRequestError("Workspace name must be unique");
  }

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
};

export const deleteWorkspaceByIdService = async (
  workspaceId: string,
  userId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) throw new NotFoundError("Workspace not found");

    if (workspace.ownerId !== userId) {
      throw new AuthError("Not allowed");
    }

    await tx.task.deleteMany({ where: { workspaceId } });
    await tx.project.deleteMany({ where: { workspaceId } });
    await tx.member.deleteMany({ where: { workspaceId } });

    const user = await tx.user.findUnique({ where: { id: userId } });

    let newWorkspaceId = null;

    if (user?.currentWorkspaceId === workspaceId) {
      const other = await tx.member.findFirst({
        where: { userId },
      });

      newWorkspaceId = other?.workspaceId || null;

      await tx.user.update({
        where: { id: userId },
        data: { currentWorkspaceId: newWorkspaceId },
      });
    }

    await tx.workspace.delete({
      where: { id: workspaceId },
    });

    return { currentWorkspaceId: newWorkspaceId };
  });
};

export const switchCurrentWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  const membership = await prisma.member.findFirst({
    where: { userId, workspaceId },
  });

  if (!membership) throw new AuthError("Not a member");

  return await prisma.user.update({
    where: { id: userId },
    data: { currentWorkspaceId: workspaceId },
  });
};
