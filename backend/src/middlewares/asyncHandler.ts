import { NextFunction, Request, Response } from "express"

type asyncFunctionType = (
    req:Request,
    res:Response,
    next:NextFunction
) => Promise<any>

const asyncHandler = (fn:asyncFunctionType):asyncFunctionType => {
    return async (req:Request,res:Response,next:NextFunction) => {
        try {
            await fn(req,res,next)
        } catch (error) {
            next(error);
        }
    }
}

export default asyncHandler;