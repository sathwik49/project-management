import { Response,Request } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { getCurrentUserService } from "../services/user.service";
import { AuthError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";

export const getCurrentUserController = asyncHandler(
    async(req:Request,res:Response) => {
        const userId = req.user as UserInterface;

        if(!userId){
            throw new AuthError("UnAuthorized");
        }

        const user = await getCurrentUserService(userId.id);

        return res.status(200).json({
            message:"User Fetched successfully",
            user: user
        })
    }
)