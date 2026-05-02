import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthError, NotFoundError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";
import { joinWorkSpaceService } from "../services/member.service";

export const joinWorkSpaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = req.params.inviteCode;

    if (!inviteCode || typeof inviteCode !== "string") {
      throw new NotFoundError("Invalid or missing invite code");
    }

    const { id: userId } = req.user as UserInterface;

    if (!userId) {
      throw new AuthError("Unauthorized");
    }

    const result = await joinWorkSpaceService(inviteCode, userId);

    return res.status(200).json({
      success: true,
      message: "Successfully joined the workspace",
      details: result,
    });
  },
);
