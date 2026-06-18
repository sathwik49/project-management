import { NextFunction, Request, Response } from "express";
import { AuthError } from "../utils/error";
import { UserInterface } from "../utils/interfaces";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as UserInterface;
  if (!user?.id) {
    return next(new AuthError("Unauthorized"));
  }
  next();
};

export default isAuthenticated;
