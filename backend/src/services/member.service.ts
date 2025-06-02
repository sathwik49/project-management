import { prisma } from "../config/db"
import { AuthError, NotFoundError } from "../utils/error"


export const getMemberRoleInWorkspace = async (userId:string,workspaceId:string) => {

    const workspace = await prisma.workspace.findUnique({
        where:{
            id:workspaceId
        }
    })

    if(!workspace){
        throw new NotFoundError("Workspace not found")
    }

    const member = await prisma.member.findFirst({
        where:{
            AND:{
                userId:userId,
                workspaceId:workspaceId
            }
        },
        select:{
            role:{
                select:{
                    name:true
                }
            }
        }
    })
    if(!member){
        throw new AuthError("Your are not member of this workspace")
    }

    return member.role.name;
}