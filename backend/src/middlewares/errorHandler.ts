import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  let statusCode = 500;
  let response: any = {
    success: false,
    message: "Internal Server Error",
  };

  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));
    statusCode = 400;
    response = {
      success: false,
      message: "Validation Failed",
      details: errors,
    };
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    response = {
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    };
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    response = {
      success: false,
      message: "Invalid data format",
    };
  } else {
    console.error("Unhandled Error:", err);
    response.message = err.message || "Internal Server Error";
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
