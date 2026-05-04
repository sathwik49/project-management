import { prisma } from "../config/db";
import { AuthError, BadRequestError, NotFoundError } from "../utils/error";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const member = await prisma.member.findFirst({
    where: {
      userId,
      workspaceId,
    },
    select: {
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!member) {
    throw new AuthError("You are not a member of this workspace");
  }

  return member.role.name;
};

export const joinWorkSpaceService = async (
  inviteCode: string,
  userId: string,
): Promise<{ workspaceId: string; role: string }> => {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: { inviteCode },
    });

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    const existingMember = await tx.member.findFirst({
      where: {
        userId,
        workspaceId: workspace.id,
      },
    });

    if (existingMember) {
      throw new BadRequestError("You are already a member of this workspace");
    }

    const role = await tx.role.findFirst({
      where: { name: "MEMBER" },
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    await tx.member.create({
      data: {
        userId,
        workspaceId: workspace.id,
        roleId: role.name,
      },
    });

    const user = await tx.user.findUnique({ where: { id: userId } });

    if (!user?.currentWorkspaceId) {
      await tx.user.update({
        where: { id: userId },
        data: { currentWorkspaceId: workspace.id },
      });
    }

    return {
      workspaceId: workspace.id,
      role: role.name,
    };
  });
};
