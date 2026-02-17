import { prisma } from "../config/db";
import { AuthError } from "../utils/error";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    omit: {
      createdAt: true,
      updatedAt: true,
      isActive: true,
      lastLogin: true,
      id: true,
    },
    include: {
      currentWorkspace: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AuthError("UnAuthorized");
  }

  return user;
};
