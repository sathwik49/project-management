import { prisma } from "../config/db";
import { $Enums } from "../generated/prisma";
import { AuthError, DataBaseError, NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";

export const createWorkspaceService = async (
  userId: string,
  data: { name: string; description?: string }
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }
  const ownerRole = await prisma.role.findFirst({
    where: {
      name: "OWNER",
    },
  });
  if (!ownerRole) {
    throw new NotFoundError("Owner role not found");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      description: data.description,
      inviteCode: genUUid(7),
      ownerId: user.id,
    },
  });
  if (!workspace) {
    throw new DataBaseError("Failed to create workspace.Please try again");
  }

  const member = await prisma.member.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      roleId: ownerRole.name,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      currentWorkspaceId: workspace.id,
    },
  });

  return workspace;
};

export const getUserWorkspacesService = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const memberships = await prisma.member.findMany({
    where: {
      userId: userId,
    },
    select: {
      workspace: true,
    },
  });
  if (memberships.length === 0) {
    throw new NotFoundError("Workspaces not found");
  }

  const workspaces = memberships.map((member) => member.workspace);
  return workspaces;
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    throw new NotFoundError("No workspace found");
  }

  const members = await prisma.member.findMany({
    where: {
      workspaceId: workspaceId,
    },
    include: {
      role: true,
    },
  });

  const membersInWorkspace = members.map((member) => member);
  const membersAndWorkspace = {
    members: membersInWorkspace,
    workspace: workspace,
  };
  return membersAndWorkspace;
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
    select: {
      members: true,
    },
  });
  if (!workspace) {
    throw new NotFoundError("No workspace found");
  }

  const members = await prisma.member.findMany({
    where: { workspaceId },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          currentWorkspaceId: true,
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

  //console.log(members)
  return members;
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await prisma.task.count({
    where: {
      workspaceId: workspaceId,
    },
  });

  const overdueTasks = await prisma.task.count({
    where: {
      workspaceId: workspaceId,
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
      workspaceId: workspaceId,
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

export const changeMemberRoleService = async (
  userId: string,
  workspaceId: string,
  memberId: string,
  roleId: $Enums.ProjectRole
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const role = await prisma.role.findFirst({
    where: {
      name: roleId,
    },
  });
  if (!role) {
    throw new NotFoundError("Role Not found");
  }

  const member = await prisma.member.findFirst({
    where: {
      userId: memberId,
      workspaceId: workspaceId,
    },
  });
  if (!member) {
    throw new NotFoundError("Member not found in workspace");
  }

  const updatedMember = await prisma.member.update({
    where: {
      id: member.id,
    },
    data: {
      roleId: roleId,
    },
  });

  return updatedMember;
};

export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: name || workspace.name,
      description: description || workspace.description,
    },
  });

  return updatedWorkspace;
};

export const deleteWorkspaceByIdService = async (workspaceId: string,userId:string) => {
  return await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: {
        id: workspaceId,
      },
    });
    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if(workspace.ownerId.toString()!==userId){
        throw new AuthError("You are not authorized to perform this operation")
    }

    const user = await tx.user.findFirst({
        where:{id:userId}
    })
    if(!user){
        throw new NotFoundError("User not found")
    }

    await tx.project.deleteMany({
        where:{workspaceId:workspaceId}
    })

    await tx.task.deleteMany({
        where:{workspaceId:workspaceId}
    })

    await tx.member.deleteMany({
        where:{workspaceId:workspaceId}
    })
    let currentWorkspace;
    if(user.currentWorkspaceId === workspaceId){
        const memberWorkspace = await tx.member.findFirst({
            where:{
                userId:userId
            }
        })
        currentWorkspace = await tx.user.update({
        where:{id:userId},
        data:{
            currentWorkspaceId:memberWorkspace?.workspaceId || null
        },
    })
    }
    await tx.workspace.delete({
        where:{id:workspaceId}
    })
    return {
        currentWorkspaceId:currentWorkspace?.currentWorkspaceId
    }
  });
};
