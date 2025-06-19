import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthError, NotFoundError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";
import { joinWorkSpaceService } from "../services/member.service";

export const joinWorkSpaceController = asyncHandler(
    async(req:Request,res:Response) => {
        const inviteCode = req.params.inviteCode
        if(!inviteCode || typeof inviteCode !=="string"){
            throw new NotFoundError("Invite code not found or wrong code")
        }
        const {id:userId} = req.user as UserInterface
        if(!userId){
            throw new AuthError()
        }

        const { workspaceId,role } = await joinWorkSpaceService(inviteCode,userId)

        return res.status(200).json({
            message:"Successfully joined the workspace",
            workspaceId,
            role
        })
    }
)