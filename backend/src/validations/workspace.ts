import { z } from "zod"

export const workspaceNameSchema = z.string().trim().min(1,{message:"workspace name is required"}).max(150,{message:"Max only 150 chars"})
export const workspaceDescriptionSchema = z.string().trim().optional()

export const createWorkspaceSchema = z.object({
    name:workspaceNameSchema,
    description:workspaceDescriptionSchema
})

export const updateWorkspaceSchema = z.object({
    name:workspaceNameSchema,
    description:workspaceDescriptionSchema
})