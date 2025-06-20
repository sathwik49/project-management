import { Request, Response } from "express";
import { appConfig } from "../config/appConfig";
import { UserInterface } from "../utils/interfaces";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/auth.validation";
import { ValidationError } from "../utils/error";
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
      `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
    );
  }

  return res.redirect(
    `${appConfig.FRONTEND_ORIGIN}/workspace/${currentWorkspaceId}`
  );
};

export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userRegistrationSchema.safeParse({ ...req.body });
    if(!validation.success){
      throw new ZodError(validation.error.errors)
    }
    const { name, email, password } = req.body;
    const user = await userRegistrationService({ name, email, password });

    return res.status(200).json({
      message: user.message,
    });
  }
);

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userLoginSchema.safeParse({ ...req.body });
    if(!validation.success){
      throw new ZodError(validation.error.errors)
    }
    const { email, password } = req.body;

    const user = await userLoginService({ email, password },req);

    if (user.message) {
      return res.status(400).json({
        message: user.message,
      });
    }

    return res.redirect(
      `${appConfig.FRONTEND_ORIGIN}/workspace/${user.currentWorkspaceId}`
    )
    //return res.status(200).json({ message: "Logged in successfully",details:user });
  }
);

export const emailVerificationController = asyncHandler(
  async (req:Request,res:Response) => {
    const token = req.params["id"];
    if(!token || typeof token !== "string"){
      return res.status(400).json({
        message:"Invalid verification link"
      })
    }
    const status = await emailVerificationService(token,req);

    if(status.message){
      return res.status(400).json({
        message:status.message
      })
    }
    const currentWorkspaceId = status.updatedUser?.currentWorkspaceId
    return res.redirect(
      `${appConfig.FRONTEND_ORIGIN}/workspace/${currentWorkspaceId}`
    )
  }
)

export const userLogoutController = asyncHandler(
  async (req:Request,res:Response) => {
    // if(!req.sessionID){
    //   return res.status(400).json({message:"No Session"})
    // }

    // req.logOut((err)=>{
    //   console.log("logout called")
    //   if(err) throw new Error(err);     --> Session cookie is not being cleared in this use
    // })

    req.session.destroy((err)=>{
      if(err) throw new Error("Couldn't logout.Please try again");
    })
    return res.status(200).json({message:"Logged out successfully"})
  }
)
