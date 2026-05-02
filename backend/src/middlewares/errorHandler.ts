import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/error";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  let statusCode = 500;

  let response: any = {
    success: false,
    message: "Internal Server Error",
    details: null,
  };

  if (err instanceof ZodError) {
    statusCode = 400;
    response = {
      success: false,
      message: "Validation Failed",
      details: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    };
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    response = {
      success: false,
      message: err.message,
      details: err.details || null,
    };
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    response = {
      success: false,
      message: "Invalid data format",
      details: null,
    };
  } else {
    console.error("Unhandled Error:", err);
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
