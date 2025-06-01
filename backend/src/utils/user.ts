import { prisma } from "../config/db"
import redis from "./redis";


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

export const setUserVerificationToken = async (token:string,email:string) => {
    await redis.set(`email:${email}`,token,"EX",10*60);
    await redis.set(`token:${token}`,email,"EX",10*60);
    // let tokenCount = parseInt((await redis.get(`tokenCount:${email}`)) || "0") 
    // await redis.set(`tokenCount:${email}`,tokenCount+1)
}

export const checkEmailVerificationToken = async (token:string) => {
    const isTokenAvailable = await redis.get(token);
    return isTokenAvailable;
}

export const deleteEmailVerificationTokens = async (token:string) => {
    const email = await redis.get(`token:${token}`)
    await redis.del(`token:${token}`)
    await redis.del(`email:${email}`)
}