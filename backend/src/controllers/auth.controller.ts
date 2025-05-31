import { Request, Response } from "express";
import { appConfig } from "../config/appConfig";
import { UserInterface } from "../utils/interfaces";


export const googleLogin = async ( req:Request,res:Response ) => {
    const { currentWorkspaceId }  = req.user as UserInterface
    if(!currentWorkspaceId){
        return res.redirect(`${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
    }

    return res.redirect(`${appConfig.FRONTEND_ORIGIN}/workspace/${currentWorkspaceId}`);
}