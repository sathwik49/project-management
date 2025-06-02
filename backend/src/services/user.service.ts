import { prisma } from "../config/db"
import { AuthError } from "../utils/error";


export const getCurrentUserService = async (userId:string) =>{
    const user = await prisma.user.findFirst({
        where:{id:userId},
        include:{
            currentWorkspace:true
        }
    })

    if(!user){
        throw new AuthError("UnAuthorized");
    }

    return user;
}