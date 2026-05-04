import { Request, Response } from "express";
import { appConfig } from "../config/appConfig";
import { UserInterface } from "../utils/interfaces";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/auth.validation";
import {
  emailVerificationService,
  userLoginService,
  userRegistrationService,
} from "../services/auth.service";
import asyncHandler from "../middlewares/asyncHandler";
import { ZodError } from "zod";

export const googleLogin = async (req: Request, res: Response) => {
  const { currentWorkspaceId } = req.user as UserInterface;

  if (!currentWorkspaceId) {
    return res.redirect(
      `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
    );
  }

  return res.redirect(`${appConfig.FRONTEND_REDIRECT_URL}`);
};

export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userRegistrationSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ZodError(validation.error.errors);
    }

    await userRegistrationService(req.body);

    return res.status(200).json({
      success: true,
      message: "Verification link sent",
      details: null,
    });
  },
);

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userLoginSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ZodError(validation.error.errors);
    }

    await userLoginService(req.body, req);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      details: null,
    });
  },
);

export const emailVerificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.params.token;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid verification link",
        details: null,
      });
    }

    const result = await emailVerificationService(token, req);

    if (result.message) {
      return res.status(400).json({
        success: false,
        message: result.message,
        details: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified",
      details: result.updatedUser,
    });
  },
);

export const userLogoutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      res.clearCookie("proman-session", {
        httpOnly: true,
        sameSite: "lax",
        secure: appConfig.NODE_ENV === "production",
      });
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
        details: null,
      });
    });
  },
);
