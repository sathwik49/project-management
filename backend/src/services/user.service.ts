import { prisma } from "../config/db";
import { AuthError } from "../utils/error";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },

    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      currentWorkspaceId: true,

      currentWorkspace: {
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

  if (!user) {
    throw new AuthError("Unauthorized");
  }

  return user;
};
