import { NextFunction, Request, Response } from "express";
import { AuthError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AuthError("Unauthorized"));
  }

  next();
};

export default isAuthenticated;
