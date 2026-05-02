import { render } from "@react-email/components";
import { prisma } from "../../config/db";
import EmailVerification from "./mail-templates/VerifyEmail";
import { appConfig } from "../../config/appConfig";
import { genUUid } from "../gen-uuid";
import resend from "./resend";
import React from "react";
import { AppError } from "../error";
import { setUserVerificationToken } from "../tokens";

const checkEmailVerificationAndSendMail = async (email: string) => {
  const user = await prisma.account.findFirst({
    where: {
      providerId: email,
      provider: "EMAIL",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.emailVerified) {
    return true;
  }

  const token = genUUid(15);
  const userName = user.user.name;
  const verificationLink = `${appConfig.FRONTEND_ORIGIN}/verify-email/${token}`;

  const emailHtml = await render(
    React.createElement(EmailVerification, { userName, verificationLink }),
  );

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Email Verification",
    html: emailHtml,
  });

  if (error) return null;

  await setUserVerificationToken(token, email);

  return true;
};

export default checkEmailVerificationAndSendMail;
