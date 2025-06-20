import * as z from "zod"

export const emailValidationSchema = z.string().trim().email({message:"Invalid email"})
export const passwordValidationSchema = z.string().trim().min(6,{message:"Password must contain min 6 characters"}).max(150,{message:"Name must not exceed 150 characters"})

export const userRegistrationSchema = z.object({
    "name":z.string().trim().min(1,{message:"Required"}).max(150,{message:"Name must not exceed 150 characters"}),
    "email":emailValidationSchema,
    "password":passwordValidationSchema,
})

export  type userSignupSchemaType = z.infer<typeof userRegistrationSchema>


export const userLoginSchema = z.object({
    "email":emailValidationSchema,
    "password":passwordValidationSchema,
})

export  type userLoginSchemaType = z.infer<typeof userLoginSchema>