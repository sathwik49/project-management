import { prisma } from "../config/db";
import { NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";

interface Props {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
  password?: string;
}

export const loginOrCreateAccountService = async (data: Props) => {
  try {
    const { provider, displayName, providerId, picture, email, password } = data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    let emailVerified = provider === "GOOGLE" || "GITHUB" ? true : false;

    if (!existingUser) {
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: displayName,
            email: email!,
            profilePicture: picture,
            lastLogin: new Date(),
          },
        });

        const account = await tx.account.create({
          data: {
            provider: provider,
            providerId: providerId,
            password: password,
            emailVerified: emailVerified,
            userId: user.id,
          },
        });

        const workspace = await tx.workspace.create({
          data: {
            name: "My Workspace",
            description: "Default Workspace",
            inviteCode: genUUid(),
            ownerId: user.id,
          },
        });

        const userRole = await tx.role.findFirst({
          where: {
            name: "OWNER",
          },
        });

        if (!userRole) {
          throw new NotFoundError("User Role Not found in DB");
        }

        const member = await tx.member.create({
          data: {
            userId: user.id,
            workspaceId: workspace.id,
            roleId: userRole.name,
          },
        });
        
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            currentWorkspaceId: workspace.id,
          },
        });
        const userDetails = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          profilePicture: updatedUser.profilePicture,
          currentWorkspaceId:updatedUser.currentWorkspaceId
        };
        return userDetails;
      });
    }
    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      profilePicture: existingUser.profilePicture,
      currentWorkspaceId:existingUser.currentWorkspaceId
    };
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    throw new Error("Something wrong happened.Please try again.");
  }
};
