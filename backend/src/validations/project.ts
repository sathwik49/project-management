import { z } from "zod"

export const projectNameSchema = z.string().trim().min(1,{message:"Project name is required"}).max(150,{message:"Max only 150 chars"})
export const projectDescriptionSchema = z.string().trim().optional()
export const projectIdSchema = z.string().min(1,{message:"Project Id is required"})

export const createProjectSchema = z.object({
    name:projectNameSchema,
    description:projectDescriptionSchema,
    image:z.string().trim().optional(),
})

export const updateProjectSchema = z.object({
    name:projectNameSchema,
    description:projectDescriptionSchema,
    image:z.string().trim().optional(),
})