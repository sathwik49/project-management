import { prisma } from "../config/db"
import { AuthError, BadRequestError, NotFoundError } from "../utils/error"


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

export const joinWorkSpaceService = async (inviteCode:string,userId:string) => {
    const workspace = await prisma.workspace.findFirst({
        where:{inviteCode}
    })
    if(!workspace){
        throw new NotFoundError("Workspace not found")
    }
    
    const existingMember = await prisma.member.findFirst({
        where:{
            userId:userId,
            workspaceId:workspace.id
        }
    })
    if(existingMember){
        throw new BadRequestError("You are already a member of this workspace")
    }

    const role = await prisma.role.findFirst({
        where:{
            name:"MEMBER"
        }
    })
    if(!role){
        throw new NotFoundError("Role not found")
    }

    const newMember = await prisma.member.create({
        data:{
            userId:userId,
            workspaceId:workspace.id,
            roleId:role.name
        }
    })

    return {
        workspaceId:workspace.id,
        role:role.name
    }
}