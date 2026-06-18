import { UserInterface } from "../utils/interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
