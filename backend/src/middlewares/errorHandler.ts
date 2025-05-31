import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";

const errorHandler:ErrorRequestHandler = (err, req, res, next):any => {

    //Handle Zod Error
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
        message:"Internal Server error",
        error:err.message || "Something Went Wrong"
    })
}

export default errorHandler;