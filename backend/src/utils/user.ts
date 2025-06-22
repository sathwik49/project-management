import { prisma } from "../config/db"


export const getUserById = async (id:string) => {
    const user = await prisma.user.findFirst({
        where:{id:id},
    })
    return user;
}

export const getUserByEmail = async (email:string) => {
    const user = await prisma.user.findFirst({
        where:{email},
        select:{
            name:true,
            email:true
        }
    })
    return user;
}

export const checkIsEmailVerified = async (email:string)=> {
    const emailVerification = await prisma.account.findFirst({
        where:{
            providerId:email
        },
        select:{
            emailVerified:true
        }
    })

    return emailVerification?.emailVerified || false
}