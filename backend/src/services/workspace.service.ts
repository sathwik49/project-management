import { prisma } from "../config/db"
import { DataBaseError, NotFoundError } from "../utils/error"
import { genUUid } from "../utils/gen-uuid"


export const createWorkspaceService = async (userId:string,data:{name:string,description?:string}) => {

    const user = await prisma.user.findFirst({
        where:{id:userId}
    })

    if(!user){
        throw new NotFoundError("User not found")
    }
    const ownerRole = await prisma.role.findFirst({
        where:{
            name:"OWNER"
        }
    })
    if(!ownerRole){
        throw new NotFoundError("Owner role not found")
    }

    const workspace = await prisma.workspace.create({
        data:{
            name:data.name,
            description:data.description,
            inviteCode:genUUid(7),
            ownerId:user.id
        },
    })
    if(!workspace){
        throw new DataBaseError("Failed to create workspace.Please try again");
    }

    const member = await prisma.member.create({
        data:{
            userId:user.id,
            workspaceId:workspace.id,
            roleId:ownerRole.name
        }
    })

    await prisma.user.update({
        where:{id:user.id},
        data:{
            currentWorkspaceId:workspace.id
        }
    })

    return workspace;
}

export const getUserWorkspacesService = async (userId:string) => {
    const user = await prisma.user.findFirst({
        where:{id:userId}
    })

    if(!user){
        throw new NotFoundError("User not found")
    }

    const memberships = await prisma.member.findMany({
        where:{
            userId:userId
        },
        select:{
            workspace:true
        }
    })
    if(memberships.length === 0){
        throw new NotFoundError("Workspaces not found")
    }

    const workspaces = memberships.map((member) => member.workspace)
    return workspaces
}

export const getWorkspaceByIdService = async (workspaceId:string) => {
    const workspace = await prisma.workspace.findFirst({
        where:{
            id:workspaceId
        }
    })
    if(!workspace){
        throw new NotFoundError("No workspace found");
    }

    const members = await prisma.member.findMany({
        where:{
            workspaceId:workspaceId,
        },
        include:{
            role:true,
        }
    })

    const membersInWorkspace = members.map((member)=>member);
    const membersAndWorkspace = {
        members:membersInWorkspace,
        workspace:workspace
    }
    return membersAndWorkspace
}

export const getWorkspaceMembersService = async (workspaceId:string) => {
    const workspace = await prisma.workspace.findFirst({
        where:{
            id:workspaceId
        },
        select:{
            members:true
        }
    })
    if(!workspace){
        throw new NotFoundError("No workspace found");
    }

    const members = await prisma.member.findMany({
        where:{workspaceId},
        select:{
            user:{
                select:{
                   id:true,
                   name:true,
                   email:true,
                   currentWorkspaceId:true,
                   profilePicture:true,
                }
            },
            role:{
                select:{
                    name:true,
                    permissions:true
                }
            }
        },
    })

   //console.log(members)
   return members

}