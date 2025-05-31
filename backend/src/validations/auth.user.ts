import * as z from "zod"

export const userSignupSchema = z.object({
    "name":z.string().min(1,{message:"Required"}).max(150,{message:"Name must not exceed 150 characters"}),
    "email":z.string().min(1,{message:"Required"}).email({message:"Invalid email"}),
    "password":z.string().min(6,{message:"Password must contain min 6 characters"}).max(150,{message:"Name must not exceed 150 characters"}),
})

export  type userSignupSchemaType = z.infer<typeof userSignupSchema>


export const userLoginSchema = z.object({
    "email":z.string().min(1,{message:"Required"}).email({message:"Invalid email"}),
    "password":z.string().min(1,{message:"Required"}).max(150,{message:"Name must not exceed 150 characters"}),
})

export  type userLoginSchemaType = z.infer<typeof userLoginSchema>