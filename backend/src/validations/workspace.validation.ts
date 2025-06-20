import { z } from "zod"

export const workspaceNameSchema = z.string().trim().min(1,{message:"Workspace name is required"}).max(150,{message:"Max only 150 chars"})
export const workspaceDescriptionSchema = z.string().trim().optional()
export const workspaceIdSchema = z.string().min(1,{message:"Workspace Id is required"})
export const changeMemberRoleSchema = z.object({
    memberId:z.string().trim().min(1,{message:"MemberID is required"}),
    roleId:z.enum(["OWNER","ADMIN","MEMBER"])
})

export const createWorkspaceSchema = z.object({
    name:workspaceNameSchema,
    description:workspaceDescriptionSchema
})

export const updateWorkspaceSchema = z.object({
    name:workspaceNameSchema,
    description:workspaceDescriptionSchema
})