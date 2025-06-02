import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";
import { ZodError } from "zod";

const formatZodError = (error:ZodError,res:Response) => {
    const errors = error.issues.map((err)=>({
        field:err.path[0],
        message:err.message
    }))

    return res.status(400).json({
        message:"Validation Failed",
        error:errors
    })
}

const errorHandler:ErrorRequestHandler = (err, req, res, next):any => {

    //Handle Zod Error
    if(err instanceof ZodError){
        return formatZodError(err,res);
    }

    if(err instanceof SyntaxError){
        return res.status(400).json({
            message:"Invalid data format"
        })
    }

    if(err instanceof AppError){
        console.log(`Error: ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            message:err.message,
            ...(err.details && { details:err.details})
        })
    }
    
    console.log("Unhandled Error");
    console.log(err);

    return res.status(500).json({
        message:err.message || "Internal Server error",
    })
}

export default errorHandler;