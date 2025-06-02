import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { createWorkspaceService, getUserWorkspacesService, getWorkspaceByIdService, getWorkspaceMembersService } from "../services/workspace.service";
import { createWorkspaceSchema } from "../validations/workspace";
import { ZodError } from "zod";
import { UserInterface } from "../utils/interfaces";
import { AppError, AuthError } from "../utils/error";
import { getMemberRoleInWorkspace } from "../services/member.service";

export const createWorkspaceController = asyncHandler(
    async (req:Request,res:Response,next:NextFunction ) => {
        const validation = createWorkspaceSchema.safeParse(req.body);
        if(!validation.success){
            throw new ZodError(validation.error.issues)
        }
        const { id:userId } = req.user as UserInterface
        if(!userId){
            throw new AuthError("UnAuthorized")
        }
        const workspace = await createWorkspaceService(userId,validation.data);

        return res.status(200).json({
            message:"Workspace created successfully",
            workspace:workspace
        })
    }
)

export const getUserWorkspacesController = asyncHandler(
    async (req:Request,res:Response) => {
        const { id:userId } = req.user as UserInterface
        if(!userId){
            throw new AuthError();
        }

        const workspaces = await getUserWorkspacesService(userId)

        return res.status(200).json({
            message:"Fetched all user workspaces as member",
            workspaces:workspaces
        })
    }
)

export const getWorkspaceByIdController = asyncHandler(
    async (req:Request,res:Response) => {
        const { id:userId } = req.user as UserInterface
        if(!userId){
            throw new AuthError();
        }
        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId !=="string"){
            throw new AppError("No Workspace Id provided")
        }

        const roleName = await getMemberRoleInWorkspace(userId,workspaceId)
        //console.log(roleName)

        const membersAndWorkspace = await getWorkspaceByIdService(workspaceId);

        return res.status(200).json({
            message:"Fetched the workspace with members successfully",
            workspaceWithMembers:membersAndWorkspace
        })
    }
)

export const getWorkspaceMembersController = asyncHandler(
    async (req:Request,res:Response) =>{
        const { id:userId } = req.user as UserInterface
        if(!userId){
            throw new AuthError();
        }
        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId !=="string"){
            throw new AppError("No Workspace Id provided")
        }
        const role = await getMemberRoleInWorkspace(userId,workspaceId);
        //roleGuard(role,[])
        const members = await getWorkspaceMembersService(workspaceId)

        return res.status(200).json({
            message:"Workspace members fetched successfully",
            members:members
        })
    }
)