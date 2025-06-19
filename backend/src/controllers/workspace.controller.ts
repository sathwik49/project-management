import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { changeMemberRoleService, createWorkspaceService, deleteWorkspaceByIdService, getUserWorkspacesService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService, updateWorkspaceByIdService } from "../services/workspace.service";
import { changeMemberRoleSchema, createWorkspaceSchema, updateWorkspaceSchema } from "../validations/workspace";
import { ZodError } from "zod";
import { UserInterface } from "../utils/interfaces";
import { AppError, AuthError, ValidationError } from "../utils/error";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { ProjectPermission } from "../utils/enums";

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

        const role = await getMemberRoleInWorkspace(userId,workspaceId)
        //console.log(roleName)
        roleGuard(role,[ProjectPermission.VIEW_ONLY])

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
        roleGuard(role,[ProjectPermission.VIEW_ONLY])
        const members = await getWorkspaceMembersService(workspaceId)

        return res.status(200).json({
            message:"Workspace members fetched successfully",
            members:members
        })
    }
)

export const getWorkspaceAnalyticsController = asyncHandler(
    async (req:Request,res:Response) => {
        const {id:userId} = req.user as UserInterface
        if(!userId){
            throw new AuthError();
        }
        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId!=="string"){
            return res.status(400).json({message:"Workspace Id is required"})
        }
        const role = await getMemberRoleInWorkspace(userId,workspaceId)
        roleGuard(role,[ProjectPermission.VIEW_ONLY])
        const analytics = await getWorkspaceAnalyticsService(workspaceId)

        return res.status(200).json({
            message:"Workspace Analytics fetched successfully",
            analytics
        })
    }
)

export const changeWorkspaceMemberRoleController = asyncHandler(
    async (req:Request,res:Response) => {
        const {id:userId} = req.user as UserInterface
        if(!userId){
            throw new AuthError();
        }
        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId!=="string"){
            return res.status(400).json({message:"Workspace Id is required"})
        }
        const data = changeMemberRoleSchema.safeParse(req.body)
        if(!data.success){
            throw new ZodError(data.error.errors)
        }
        const { memberId,roleId } = data.data
        
        const role = await getMemberRoleInWorkspace(userId,workspaceId)
        roleGuard(role,[ProjectPermission.CHANGE_MEMBER_ROLE])

        const member = await changeMemberRoleService(userId,workspaceId,memberId,roleId)

        return res.status(200).json({
            message:"Updated Member role successfully",
            member:member
        })
    }
)

export const updateWorkspaceByIdController = asyncHandler(
    async(req:Request,res:Response) => {
        const {id:userId} = req.user as UserInterface
        if(!userId){
            throw new AuthError()
        }

        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId!=="string"){
            throw new ValidationError("Invalid WorkspaceId")
        }

        const data = updateWorkspaceSchema.safeParse(req.body)
        if(!data.success){
            throw new ZodError(data.error.errors)
        }
        const { name,description } = data.data
        const role = await getMemberRoleInWorkspace(userId,workspaceId)
        roleGuard(role,[ProjectPermission.EDIT_WORKSPACE])

        const workspace = await updateWorkspaceByIdService(workspaceId,name,description)

        return res.status(200).json({
            message:"Updated workspace successfully",
            workspace:workspace
        })
    }
)

export const deleteWorkspaceByIdController = asyncHandler(
    async (req:Request,res:Response) => {
        const {id:userId} = req.user as UserInterface
        if(!userId){
            throw new AuthError()
        }

        const workspaceId = req.params.id
        if(!workspaceId || typeof workspaceId!=="string"){
            throw new ValidationError("Invalid WorkspaceId")
        }

        const role = await getMemberRoleInWorkspace(userId,workspaceId)
        roleGuard(role,[ProjectPermission.DELETE_WORKSPACE])

        const workspace = await deleteWorkspaceByIdService(workspaceId,userId)

        return res.status(200).json({
            message:"Workspace deleted successfully",
            currentWorkspace:workspace.currentWorkspaceId
        })
    }
)