import { prisma } from "../config/db";
import { AppError, NotFoundError } from "../utils/error";
import { genUUid } from "../utils/gen-uuid";
import { compareValues, hashValue } from "../utils/hashValue";
import checkEmailVerificationAndSendMail from "../utils/mails/emailVerification";
import { Request } from "express";
import {
  checkEmailVerificationToken,
  deleteEmailVerificationTokens,
} from "../utils/tokens";
import { checkIsEmailVerified } from "../utils/user";

interface Props {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}

export const loginOrCreateAccountService = async (data: Props) => {
  const { provider, displayName, providerId, picture, email } = data;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const emailVerified = provider === "GOOGLE" || provider === "GITHUB";

  if (!existingUser) {
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: displayName,
          email,
          profilePicture: picture,
          lastLogin: new Date(),
        },
      });

      await tx.account.create({
        data: {
          provider,
          providerId,
          emailVerified,
          userId: createdUser.id,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: "My Workspace",
          description: "Default Workspace",
          inviteCode: genUUid(),
          ownerId: createdUser.id,
        },
      });

      const role = await tx.role.findFirst({
        where: { name: "OWNER" },
      });

      if (!role) {
        throw new NotFoundError("Role not found");
      }

      await tx.member.create({
        data: {
          userId: createdUser.id,
          workspaceId: workspace.id,
          roleId: role.name,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: createdUser.id },
        data: {
          currentWorkspaceId: workspace.id,
        },
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        profilePicture: updatedUser.profilePicture,
        currentWorkspaceId: updatedUser.currentWorkspaceId,
      };
    });

    return user;
  }

  await prisma.user.update({
    where: { email },
    data: { lastLogin: new Date() },
  });

  return {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    profilePicture: existingUser.profilePicture,
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
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
      },
    });

    const hashedPassword = await hashValue(password);

    await tx.account.create({
      data: {
        provider: "EMAIL",
        providerId: email,
        password: hashedPassword,
        userId: createdUser.id,
      },
    });

    const workspace = await tx.workspace.create({
      data: {
        name: "My Workspace",
        description: "Default Workspace",
        inviteCode: genUUid(),
        ownerId: createdUser.id,
      },
    });

    const role = await tx.role.findFirst({
      where: { name: "OWNER" },
    });

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    await tx.member.create({
      data: {
        userId: createdUser.id,
        workspaceId: workspace.id,
        roleId: role.name,
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: createdUser.id },
      data: {
        currentWorkspaceId: workspace.id,
      },
    });

    return updatedUser;
  });

  const emailResponse = await checkEmailVerificationAndSendMail(user.email);

  if (!emailResponse) {
    throw new AppError("Failed to send verification email", 500);
  }

  return null;
};

export const userLoginService = async (
  data: { email: string; password: string },
  req: Request,
) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "EMAIL",
    },
  });

  if (!account || !account.password) {
    throw new AppError("Use social login", 400);
  }

  const isValid = await compareValues(password, account.password);

  if (!isValid) {
    throw new AppError("Invalid credentials", 400);
  }

  if (!account.emailVerified) {
    const verified = await checkIsEmailVerified(email);

    if (!verified) {
      await checkEmailVerificationAndSendMail(email);
      throw new AppError("Please verify your email", 400);
    }
  }

  await new Promise<void>((resolve, reject) => {
    req.logIn(user, (err) => {
      if (err) return reject(err);
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return null;
};

export const emailVerificationService = async (token: string, req: Request) => {
  const tokenData = await checkEmailVerificationToken(token);

  if (!tokenData || !tokenData.token) {
    return { message: "Invalid or expired link" };
  }

  if (tokenData.expires < new Date()) {
    return { message: "Token expired" };
  }

  const account = await prisma.account.update({
    where: {
      providerId: tokenData.email,
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
      user: true,
    },
  });

  await deleteEmailVerificationTokens(tokenData.token, account.providerId);

  await new Promise<void>((resolve, reject) => {
    req.logIn(account.user, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return {
    updatedUser: {
      id: account.user.id,
      name: account.user.name,
      email: account.user.email,
      profilePicture: account.user.profilePicture,
      currentWorkspaceId: account.user.currentWorkspaceId,
    },
  };
};
