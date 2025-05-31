import { prisma } from "../config/db"


export const getUserById = async (id:string) => {
    const user = await prisma.user.findFirst({
        where:{id:id},
    })
    return user;
}