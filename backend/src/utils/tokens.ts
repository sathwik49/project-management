import { prisma } from "../config/db";

export const setUserVerificationToken = async (
  token: string,
  email: string
) => {
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  await prisma.verification.create({
    data: {
      email: email,
      token: token,
      expires: expires,
    },
  });
};

export const checkEmailVerificationToken = async (token: string) => {
  const isTokenAvailable = await prisma.verification.findFirst({
    where: {
      token,
    },
    select: {
      token: true,
      expires:true,
      email:true
    },
  });
  return isTokenAvailable;
};

export const deleteEmailVerificationTokens = async (
  token: string,
  email: string
) => {
  await prisma.verification.delete({
    where: {
      token,
      email,
    },
  });
};
