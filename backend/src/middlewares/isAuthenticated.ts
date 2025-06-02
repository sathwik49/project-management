import { NextFunction, Request, Response } from "express";
import { AuthError } from "../utils/error";


const isAuthenticated = (req:Request,res:Response,next:NextFunction ) =>{
    if(!req.user){
        throw new AuthError();
    }
    next();
}

export default isAuthenticated;