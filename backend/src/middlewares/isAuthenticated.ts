import { NextFunction, Request, Response } from "express";
import { AuthError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";


const isAuthenticated = (req:Request,res:Response,next:NextFunction ) =>{
    const user = req.user as UserInterface
    if(!user || !user.id){
        throw new AuthError();
    }
    next();
}

export default isAuthenticated;