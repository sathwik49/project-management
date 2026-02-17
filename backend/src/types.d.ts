import { UserInterface } from "../utils/interfaces";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserInterface;
  }
}

declare module "express-session" {
  interface SessionData {
    passport?: {
      user?: string;
    };
  }
}
