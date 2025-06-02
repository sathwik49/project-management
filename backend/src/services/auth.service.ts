import { prisma } from "../config/db";
import { AppError, NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";
import { compareValues, hashValue } from "../utils/hashValue";
import checkEmailVerificationAndSendMail from "../utils/mails/emailVerification";
import redis from "../utils/redis";
import { Request } from "express";
import { deleteEmailVerificationTokens } from "../utils/user";

interface Props {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
  password?: string;
}

export const loginOrCreateAccountService = async (data: Props) => {
  const { provider, displayName, providerId, picture, email } = data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  let emailVerified = provider === "GOOGLE" || "GITHUB" ? true : false;

  if (!existingUser) {
    let user = await prisma.$transaction(async (tx) => {
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
        profilePicture: updatedUser.profilePicture || null,
        currentWorkspaceId: updatedUser.currentWorkspaceId,
      };
      return userDetails;
    });
    return user;
  }
  //update lastLogin
  await prisma.user.update({
    where: { email: existingUser.email },
    data: { lastLogin: new Date() },
  });
  return {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    profilePicture: existingUser.profilePicture || " ",
    currentWorkspaceId: existingUser.currentWorkspaceId,
  };
};

export const userRegistrationService = async (data: {
  email: string;
  name: string;
  password: string;
}) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: name,
        email: email,
      },
    });
    const hashedPassword = await hashValue(password);
    const account = await tx.account.create({
      data: {
        provider: "EMAIL",
        providerId: email,
        password: hashedPassword,
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
      where: { id: user.id },
      data: {
        currentWorkspaceId: workspace.id,
      },
    });
    const userDetails = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture || null,
      currentWorkspaceId: updatedUser.currentWorkspaceId,
    };

    return userDetails;
  });
  const emailResponse = await checkEmailVerificationAndSendMail(user.email);

  if (!emailResponse) {
    return { message: "Account has been created but couldn't send verification mail.Please click on resend mail" };
  }
  return {
    message: "Verification Link sent",
    details: user,
  };
};

export const userLoginService = async (
  data: { email: string; password: string },
  req: Request
) => {
  const { email, password } = data;
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    console.log(user)
    throw new AppError("No user found with this email", 400);
  }

  const isEmailUser = await prisma.account.findFirst({
    where: {
      AND: {
        userId: user.id,
        provider: "EMAIL",
      },
    },
  });

  if (!isEmailUser) {
    throw new AppError(
      "Email is registered with Other Providers.Please try through Google/Others",
      400
    );
  }

  const isPasswordsMatching = await compareValues(
    password,
    isEmailUser.password as string
  );

  if (!isPasswordsMatching) {
    throw new AppError("Wrong Password", 400);
  }

  if (!isEmailUser.emailVerified) {
    if (await redis.get(`email:${email}`)) {
      return { message: "Please verify your email" };
    }
    await checkEmailVerificationAndSendMail(email);
    return { message: "Verification Email sent.Please verify your email." };
  }

  await new Promise<void>((resolve, reject) => {
    req.logIn(user, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      lastLogin: new Date(),
    },
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
    currentWorkspaceId: updatedUser.currentWorkspaceId,
  };
};

export const emailVerificationService = async (token: string, req: Request) => {
  const isTokenAvailable = await redis.get(`token:${token}`);

  if (!isTokenAvailable) {
    return { message: "Invalid or Expired Verification Link." };
  }

  const userWithAccount = await prisma.account.update({
    where: {
      providerId: isTokenAvailable,
    },
    data: {
      emailVerified: true,
      user: {
        update: {
          lastLogin: new Date(),
        },
      },
    },
    include: {
      user: {},
    },
  });
  await deleteEmailVerificationTokens(token);

  const updatedUser = {
    id: userWithAccount.user.id,
    name: userWithAccount.user.name,
    email: userWithAccount.user.email,
    profilePicture: userWithAccount.user.profilePicture,
    currentWorkspaceId: userWithAccount.user.currentWorkspaceId,
  };

  const user = userWithAccount.user;

  await new Promise<void>((resolve, reject) => {
    req.logIn(user, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return { updatedUser };
};
